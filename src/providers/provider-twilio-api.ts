import * as Request from 'request';
import * as TwilioChat from 'twilio-chat';
export class TwilioApiProvider {
    private _chatClient: TwilioChat.Client | null = null;

    public async getChatClient(userId: string, roomId: string): Promise<TwilioChat.Client> {
        const token: any = await this.getChatToken(userId, roomId);

        if (!token) {
            throw new Error("Wasn't able to obtain a chat token from Twilio.");
        }
        this._chatClient = await TwilioChat.Client.create(token);

        return this._chatClient;
    }

    public getChatToken(userId: string, roomId: string): Promise<any> {
        // TODO: how do we do this on a per-room basis? channels, maybe?

        return new Promise((resolve, reject) => {
            if (!process.env.REACT_APP_TWILIO_CHAT_TOKEN_ENDPOINT) {
                throw new Error("The app's Twilio Chat token endpoint hasn't been configured.");
            }

            if (!process.env.REACT_APP_TWILIO_CHAT_API_SID || !process.env.REACT_APP_TWILIO_CHAT_API_SECRET) {
                throw new Error("The app's Twilio Chat credentials haven't been configured.");
            }

            Request
                .post({
                    url: process.env.REACT_APP_TWILIO_CHAT_TOKEN_ENDPOINT,
                    headers: { 'Content-Type': 'application/json' },
                    form: {
                        deviceId: 'StrengthInNumbersWebApp',
                        identity: userId,
                        roomId,
                        twilioChatApiSid: process.env.REACT_APP_TWILIO_CHAT_API_SID,
                        twilioChatApiSecret: process.env.REACT_APP_TWILIO_CHAT_API_SECRET
                    },
                    json: true,
                    callback: (error, response, body) => {
                        if (error) {
                            reject(error);
                        }

                        resolve(body.token);
                    }
                });
        });
    }

    public getToken(userId: string, roomId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!process.env.REACT_APP_TWILIO_TOKEN_ENDPOINT) {
                throw new Error("The app's Twilio token endpoint hasn't been configured.");
            }

            if (!process.env.REACT_APP_TWILIO_API_KEY || !process.env.REACT_APP_TWILIO_API_SECRET) {
                throw new Error("The app's Twilio credentials haven't been configured.");
            }

            Request
                .post({
                    url: process.env.REACT_APP_TWILIO_TOKEN_ENDPOINT,
                    headers: { 'Content-Type': 'application/json' },
                    form: {
                        userId,
                        roomId,
                        twilioApiKey: process.env.REACT_APP_TWILIO_API_KEY,
                        twilioApiSecret: process.env.REACT_APP_TWILIO_API_SECRET
                    },
                    callback: (error, response, body) => {
                        if (error) {
                            reject(error);
                        }

                        const parsedBody = JSON.parse(body);
                        resolve(parsedBody.token);
                    }
                });
        });
    }
}
