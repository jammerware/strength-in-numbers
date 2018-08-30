import * as Request from 'request';

export class TwilioApiProvider {
    public getToken(userId: string, roomId: string): Promise<any> {
        // tslint:disable-next-line:no-console
        console.log('twilio env', process.env);

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
                    form: {
                        twilioApiKey: process.env.REACT_APP_TWILIO_API_KEY,
                        twilioApiSecret: process.env.REACT_APP_TWILIO_API_SECRET
                    },
                    callback: (error, response, body) => {
                        if (error) {
                            reject(error);
                        }

                        // tslint:disable-next-line:no-console
                        console.log('things', error, response, body);
                        resolve(body);
                    }
                });
        });
    }

    public getThing() {
        return "Hi!";
    }
}
