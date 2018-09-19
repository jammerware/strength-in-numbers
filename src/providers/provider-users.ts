import { User } from "../models/user";

export class UsersProvider {
    private _users: User[] = [
        {
            avatarUrl: '',
            displayName: 'Ben Stein',
            email: 'ben.s.stein@gmail.com',
            gender: 'male',
            googleUid: '1234'
        },
    ];

    public async getUser(userId: string) {
        const users = await this.getUsers();
        return users.find(u => u.googleUid === userId);
    }

    public getUsers(): Promise<User[]> {
        return Promise.resolve(this._users);
    }
}