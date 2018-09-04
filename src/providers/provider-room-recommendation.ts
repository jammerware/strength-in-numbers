import { Room } from '../models/room';
import { Trait } from '../models/trait';
import { User } from '../models/user';

export class RoomRecommendationProvider {
    public recommendRooms(rooms: Room[], user: User, trait: Trait): Room[] {
        // first, we need to compute the current diversity of each possible room
        rooms.sort((a, b) => {
            const aDiversity = this.getRoomDiversity(a, trait.name, trait.possibleValues);
            const bDiversity = this.getRoomDiversity(b, trait.name, trait.possibleValues);


            if (aDiversity < bDiversity) { return -1; }
            else if (aDiversity === bDiversity) { return 0; }
            return 1;
        });
        // then we need to compute the diversity of each room if the user were to join it (the user's "diversity impact")

        // then we just order the rooms in descending order of diversity impact
        return rooms;
    }

    public getRoomDiversity(room: Room, trait: string, possibleTraitValues: any[]): number {
        const numberOfParticipants = room.participants.length;
        const numberOfTraitValues = possibleTraitValues.length;

        // sort users into a map of each possible trait value to the users that have it
        // like this: {
        //      'male': [user1, user2, user3],
        //      'female': [user4, user5, user6],
        //      'other': [user7, user8, user9]
        // }

        // initialize the map of traits to users with an empty array of users for each trait
        const traitUsersMap = new Map<any, User[]>();
        for (const possibleValue of possibleTraitValues) {
            traitUsersMap.set(possibleValue, []);
        }

        // sort users by trait
        for (const user of room.participants) {
            const traitValue = user[trait];
            const usersWithTraitValue = traitUsersMap.get(traitValue);

            // if (!usersWithTraitValue) {
            //     usersWithTraitValue = [];
            //     traitUsersMap.set(traitValue, usersWithTraitValue);
            // }

            usersWithTraitValue!.push(user);
        }

        // for each trait, take
        // abs(% of people in the room with the trait - % of people in a room of the same size with perfect diversity that have the trait)
        // and sum them to compute the diversity (lower is more diverse)
        let diversity = 0;
        for (const traitValue of possibleTraitValues) {
            const pctOfUsersWithTrait = (traitUsersMap.get(traitValue)!.length / numberOfParticipants);
            const pctOfUsersWithTraitInIdealRoom = (1 / numberOfTraitValues);

            diversity += Math.abs(pctOfUsersWithTrait - pctOfUsersWithTraitInIdealRoom);
        }

        return diversity;
    }
}