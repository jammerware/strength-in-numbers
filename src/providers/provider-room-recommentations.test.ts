import { RoomRecommendationProvider } from './provider-room-recommendation';

it('computes diversity as 1 when there is 1 of each user with each trait', () => {
    const provider = new RoomRecommendationProvider();
    const room: Room = {
        id: '123',
        name: 'Diverse Room',
        participants: [
            {
                googleUid: '123',
                gender: 'male'
            },
            {
                googleUid: '456',
                gender: 'female'
            },
            {
                googleUid: '789',
                gender: 'other'
            }
        ],
    };

    const diversity = provider.getRoomDiversity(room, 'gender', ['male', 'female', 'other']);
    expect(diversity).toBe(1);
});

it('computes diversity as 1/3 when there is only 1 trait value of a possible 3 in the room', () => {
    const provider = new RoomRecommendationProvider();
    const room: Room = {
        id: '123',
        name: 'Diverse Room',
        participants: [
            {
                googleUid: '456',
                gender: 'female'
            },
        ],
    };

    const diversity = provider.getRoomDiversity(room, 'gender', ['male', 'female', 'other']);
    expect(diversity).toBe(0);
});