import * as firebase from 'firebase';

export class User {
    public avatarUrl: string | null = null;
    public displayName: string | null = null;
    public email: string | null = null;
    public gender: string | null = null;
    public googleUid: string;

    public static fromFirebaseUser(firebaseUser: firebase.User): User {
        return {
            avatarUrl: firebaseUser.photoURL,
            displayName: firebaseUser.displayName,
            email: firebaseUser.displayName,
            gender: 'other',
            googleUid: firebaseUser.uid
        };
    }
}