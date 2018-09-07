import * as firebase from 'firebase';
import * as firebaseUi from 'firebaseui';
import { StorageProvider } from './provider-storage';

export class AuthProvider {
    constructor(private storageProvider = new StorageProvider()) { }

    public getCurrentUser() {
        return firebase.auth().currentUser;
    }

    public startAuthWithSelector(selector: string) {
        // configure our authentication settings
        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: (authResult: any, redirectUrl: string) => {
                    // Don't redirect
                    return false;
                }
            },
            signInFlow: 'popup',
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                // firebaseUi.auth.AnonymousAuthProvider.PROVIDER_ID
            ],
            tosUrl: '/terms-of-service',
            privacyPolicyUrl: '/privacy'
        };

        // display the auth flow UI
        const ui = new firebaseUi.auth.AuthUI(firebase.auth());
        ui.start(selector, uiConfig);
    }

    public initFirebaseApp() {
        if (firebase.apps.length > 0) {
            return;
        }

        const appConfig = {
            apiKey: "AIzaSyAV4RDFWv3wgecvoYA6JX752Av2Jm-4htA",
            authDomain: "strength-in-numbers.firebaseapp.com",
            databaseURL: "https://strength-in-numbers.firebaseio.com",
            projectId: "strength-in-numbers",
            storageBucket: "strength-in-numbers.appspot.com",
            messagingSenderId: "1053461055195"
        };

        firebase.initializeApp(appConfig);
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                this.storageProvider.saveUser({
                    avatarUrl: firebaseUser.photoURL,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.displayName,
                    gender: 'other',
                    googleUid: firebaseUser.uid
                });
            }
        });
    }
}