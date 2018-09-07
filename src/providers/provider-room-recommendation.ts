import { Room } from '../models/room';
import { Trait } from '../models/trait';
import { User } from '../models/user';

export class RoomRecommendationProvider {
    public recommendRooms(rooms: Room[], user: User, trait: Trait): Room[] {
        // sort the rooms by descending order of diversity impact
        const orderedRooms = rooms.sort((a, b) => {
            const aDiversity = this.getDiversityImpact(user, a, trait);
            const bDiversity = this.getDiversityImpact(user, b, trait);

            if (aDiversity > bDiversity) { return -1; }
            else if (aDiversity === bDiversity) { return 0; }
            return 1;
        });

        return orderedRooms;
    }

    public getDiversity(users: User[], trait: Trait): number {
        const numberOfParticipants = users.length;

        // sort users into a map of each possible trait value to the users that have it
        // like this: {
        //      'male': [user1, user2, user3],
        //      'female': [user4, user5, user6],
        //      'other': [user7, user8, user9]
        // }

        // initialize the map of traits to users with an empty array of users for each trait
        const traitUsersMap = new Map<any, User[]>();
        for (const possibleValue of trait.possibleValues) {
            traitUsersMap.set(possibleValue, []);
        }

        // sort users by trait
        for (const user of users) {
            const traitValue = user[trait.name];
            const usersWithTraitValue = traitUsersMap.get(traitValue);

            usersWithTraitValue!.push(user);
        }

        // for each trait, compute the entropy.
        // -1*sum(p_i*log(p_i)), where p_i is proportion of each type
        let entropy = 0;
        for (const traitValue of trait.possibleValues) {
            const proportionOfUsersWithTrait = traitUsersMap.get(traitValue)!.length / numberOfParticipants;
            const log = Math.log(proportionOfUsersWithTrait) || 0;
            entropy += proportionOfUsersWithTrait * (isFinite(log) ? log : 0);
        }

        if (entropy) {
            entropy *= -1;
        }

        return entropy;
    }

    public getDiversityImpact(user: User, room: Room, trait: Trait) {
        const participantsWithProspectiveUser = room.participants.concat(user);
        const currentRoomDiversity = this.getDiversity(room.participants, trait);
        const expectedRoomDiversity = this.getDiversity(participantsWithProspectiveUser, trait);

        return expectedRoomDiversity - currentRoomDiversity;
    }
}