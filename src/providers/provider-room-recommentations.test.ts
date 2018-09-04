import { RoomRecommendationProvider } from './provider-room-recommendation';
import { Room } from '../models/room';

it('computes diversity as 0 when there is 1 of each user with each trait', () => {
    const provider = new RoomRecommendationProvider();
    const room: Room = {
        id: '123',
        name: 'Perfectly diverse room',
        participants: [
            {
                avatarUrl: null,
                displayName: null,
                email: null,
                gender: 'male',
                googleUid: '123',
            },
            {
                avatarUrl: null,
                displayName: null,
                email: null,
                googleUid: '456',
                gender: 'female'
            },
            {
                avatarUrl: null,
                displayName: null,
                email: null,
                googleUid: '789',
                gender: 'other'
            }
        ],
    };

    const diversity = provider.getRoomDiversity(room, 'gender', ['male', 'female', 'other']);
    expect(diversity).toBe(0);
});

it('computes diversity as 4/3 when there is only 1 trait value of a possible 3 in the room', () => {
    const provider = new RoomRecommendationProvider();
    const room: Room = {
        id: '123',
        name: 'One-person room',
        participants: [
            {
                avatarUrl: null,
                displayName: null,
                email: null,
                googleUid: '456',
                gender: 'female'
            },
        ],
    };

    const diversity = provider.getRoomDiversity(room, 'gender', ['male', 'female', 'other']);
    expect(diversity).toBe(4 / 3);
});

it('computes diversity as 1/3 when there are 2 other, 1 man, and 1 woman in the room', () => {
    const provider = new RoomRecommendationProvider();
    const room: Room = {
        id: '123',
        name: 'Lopsided Room',
        participants: [
            {
                avatarUrl: null,
                displayName: null,
                email: null,
                googleUid: '1',
                gender: 'other'
            },
            {
                avatarUrl: null,
                displayName: null,
                email: null,
                googleUid: '2',
                gender: 'other'
            },
            {
                avatarUrl: null,
                displayName: null,
                email: null,
                googleUid: '3',
                gender: 'male'
            },
            {
                avatarUrl: null,
                displayName: null,
                email: null,
                googleUid: '4',
                gender: 'female'
            },
        ],
    };

    const diversity = provider.getRoomDiversity(room, 'gender', ['male', 'female', 'other']);
    expect(diversity).toBe(1 / 3);
})