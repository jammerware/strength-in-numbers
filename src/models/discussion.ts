import { Room } from './room';

export class Discussion {
    public id: string;
    public title: string;
    public subtitle: string;
    public agenda: string;
    public rooms: Room[] = [];
}