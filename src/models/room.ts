import { User } from './user';

export class Room {
    public id: string;
    public name: string;
    public participants: User[];
    public startTime: number;
    public endTime?: number;
}