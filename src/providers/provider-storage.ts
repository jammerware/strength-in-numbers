import * as firebase from 'firebase';
import { User } from '../models/user';

export class StorageProvider {
    public async saveUser(user: User) {
        const firestoreClient = this.getFirestoreClient();
        let userDoc: firebase.firestore.DocumentReference;

        const existingUser = await firestoreClient
            .collection('users')
            .where('googleUid', '==', user.googleUid)
            .get();

        if (!existingUser.empty) {
            userDoc = existingUser.docs[0].ref;
        }
        else {
            userDoc = await firestoreClient
                .collection('users')
                .add(user);
        }

        const userSnapshot = await userDoc.get();
        return userSnapshot.data();
    }

    private getFirestoreClient() {
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });

        return firestore;
    }
}