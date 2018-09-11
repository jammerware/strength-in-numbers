import { AppEmailNotification } from "../models/app-email-notification";

export class AppEmailNotificationsProvider {
    public send(notification: AppEmailNotification) {
        // this will post to the HirePeer app's API to send the notification
        // and possibly log the email in the database

        // tslint:disable
        console.log('Email notification would be sent', notification);
    }
}