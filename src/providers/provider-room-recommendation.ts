import { Room } from '../models/room';
import { User } from '../models/user';

export class RoomRecommendationProvider {
    public recommendRooms(rooms: Room[], user: User): Room[] {
        // first, we need to compute the current diversity of each possible room


        // then we need to compute the diversity of each room if the user were to join it (the user's "diversity impact")

        // then we just order the rooms in descending order of diversity impact
    }

    public getRoomDiversity(room: Room, trait: string, possibleValues: any[]): number {
        // sort users into a map of each possible trait value to the users that have it
        // like this: {
        //      'male': [user1, user2, user3],
        //      'female': [user4, user5, user6],
        //      'other': [user7, user8, user9]
        // }
        const traitUsersMap = new Map<any, User[]>();
        for (const possibleValue of possibleValues) {
            traitUsersMap.set(possibleValue, []);
        }

        for (const user of room.participants) {
            const traitValue = user[trait];
            const usersWithTraitValue = traitUsersMap.get(traitValue);

            usersWithTraitValue.push(user);
        }

        // compute the diversity ratio of each trait to each other trait, using
        // the trait with the lower number of users as the left half of the ratio
        const traits = traitUsersMap.keys();
        const ratios: number[] = [];

        for (const i; i < traits.length; i++) {
            for (const j; j < traits.length; j++) {
                // don't compare a trait to itself
                if (i === j) { continue; }

                // determine whether the trait at i or the trait at j has fewer users
                let ratio = traitUsersMap.get(traits[i]).length / traitUsersMap.get(traits[j]).length;
                if (traitUsersMap.get(traits[j]).length < traitUsersMap.get(traits[i]).length) {
                    ratio = traitUsersMap.get(traits[j]).length / traitUsersMap.get(traits[i]).length;
                }

                ratios.push(ratio);
            }
        }

        let diversity = 1;
        for (const ratio of ratios) {
            // tslint:disable
            console.log('ratio', ratio);
            diversity *= ratio;
        }

        return diversity;
    }
}
