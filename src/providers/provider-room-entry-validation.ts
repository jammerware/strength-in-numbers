import { DiscussionsProvider } from "./provider-discussions";
import { Discussion } from '../models/discussion';

export class RoomEntryValidationProvider {
    private MS_PER_MINUTE = 60000;

    constructor(private discussionsProvider: DiscussionsProvider) { }

    public async canEnterRoom(currentDate: number, roomId: string): Promise<boolean> {
        const room = await this.discussionsProvider.getRoom(roomId);
        if (!room) { return false; }

        // eventually this'll be 15 minutes before the start time and an hour after start time
        // but we're widening for development
        const lowerDateBound = new Date(room.startTime).valueOf() - (this.MS_PER_MINUTE * 60 * 24 * 365);
        const upperDateBound = new Date(room.startTime).valueOf() + (this.MS_PER_MINUTE * 60 * 24 * 365);

        if (currentDate < lowerDateBound || currentDate > upperDateBound) {
            return false;
        }

        return true;
    }

    public async getRoomExists(roomId: string): Promise<boolean> {
        const discussions: Discussion[] = await this.discussionsProvider.getDiscussions();
        const discussion = discussions.find(d => !!d.rooms.find(r => r.id === roomId));

        if (!discussion) {
            return false;
        }

        return !!discussion.rooms.find(r => r.id === roomId);
    }
}