import { RoomRecommendationProvider } from './provider-room-recommendation';
import { Room } from '../models/room';
import { User } from '../models/user';

type Gender = 'male' | 'female' | 'other';
function buildTestingUser(gender: Gender, uid: string): User {
    return {
        avatarUrl: null,
        displayName: null,
        email: null,
        gender,
        googleUid: uid
    };
}

describe('Room recommendation provider', () => {
    it('computes diversity as 1.0986122886681096 when there is 1 of each user with each trait', () => {
        const provider = new RoomRecommendationProvider();

        const trait = {
            name: 'gender',
            possibleValues: ['male', 'female', 'other'],
        };

        const users = [
            buildTestingUser('male', '123'),
            buildTestingUser('female', '456'),
            buildTestingUser('other', '789'),
        ];

        const diversity = provider.getDiversity(users, trait);
        expect(diversity).toBe(1.0986122886681096);
    });

    it('computes diversity as 0 when there is only 1 trait value of a possible 3 in the room', () => {
        const provider = new RoomRecommendationProvider();

        const trait = {
            name: 'gender',
            possibleValues: ['male', 'female', 'other'],
        };

        const users = [{
            avatarUrl: null,
            displayName: null,
            email: null,
            googleUid: '456',
            gender: 'female'
        }];

        const diversity = provider.getDiversity(users, trait);
        expect(diversity).toBe(0);
    });

    it('computes diversity as 1.0397207708399179 when there are 2 other, 1 man, and 1 woman in the room', () => {
        const provider = new RoomRecommendationProvider();

        const trait = {
            name: 'gender',
            possibleValues: ['male', 'female', 'other'],
        };

        const users = [
            buildTestingUser('other', '1'),
            buildTestingUser('other', '2'),
            buildTestingUser('male', '3'),
            buildTestingUser('female', '4'),
        ];

        const diversity = provider.getDiversity(users, trait);
        expect(diversity).toBe(1.0397207708399179);
    });

    it('recommends the room when only one room is provided', () => {
        const provider = new RoomRecommendationProvider();
        const room = {
            id: '1',
            name: 'The only room',
            participants: []
        };
        const user = {
            avatarUrl: null,
            displayName: null,
            email: null,
            googleUid: '1',
            gender: 'other'
        };
        const trait = {
            name: 'gender',
            possibleValues: ['male', 'female', 'other'],
        };

        const recommendedRooms = provider.recommendRooms([room], user, trait);
        expect(recommendedRooms[0].id).toBe('1');
    });

    it('recommends the room with the highest diversity impact', () => {
        const provider = new RoomRecommendationProvider();
        const rooms = [
            {
                id: '1',
                name: 'Room in which the participant will reduce diversity',
                participants: [
                    buildTestingUser('female', '1'),
                    buildTestingUser('female', '2'),
                    buildTestingUser('male', '3')
                ]
            },
            {
                id: '2',
                name: 'Room in which the participant will increase diversity',
                participants: [
                    buildTestingUser('other', '4'),
                    buildTestingUser('male', '5')
                ]
            },
        ];
        const incomingUser = buildTestingUser('female', '6');
        const trait = {
            name: 'gender',
            possibleValues: ['male', 'female', 'other'],
        };

        const recommendations = provider.recommendRooms(rooms, incomingUser, trait);

        expect(recommendations[0].id).toBe('2');
    });

    fit('results in expected diversity over a large number of participants and rooms', () => {
        const provider = new RoomRecommendationProvider();
        const numberOfRooms = 3;
        const numberOfParticipants = 30;
        const rooms: Room[] = [];
        const trait = { name: 'gender', possibleValues: ['male', 'female', 'other'], };

        for (let i = 0; i < numberOfRooms; i++) {
            rooms.push({
                id: i.toString(),
                name: `Room ${i}`,
                participants: []
            });
        }

        // create the requested number of participants and push them into 
        // their first recommended room
        for (let i = 0; i < numberOfParticipants; i++) {
            const participant = buildTestingUser(trait.possibleValues[Math.floor(Math.random() * trait.possibleValues.length)] as Gender, i.toString());

            const recommendedRooms = provider.recommendRooms(rooms, participant, trait);
            recommendedRooms[0].participants.push(participant);
        }

        for (const room of rooms) {
            expect(room.participants.length).toBeGreaterThanOrEqual(8);
            expect(room.participants.length).toBeLessThanOrEqual(20);
        }
    });
});