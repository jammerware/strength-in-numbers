export enum AppEmailNotificationType {
    REPORT_MISCONDUCT
}

export class AppEmailNotification {
    public body: string;
    public subject: string;
    public type: AppEmailNotificationType;
}