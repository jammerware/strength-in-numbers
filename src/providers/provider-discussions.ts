import { Discussion } from '../models/discussion';

export class DiscussionsProvider {
    private DUMMY_DISCUSSIONS: Discussion[] = [
        {
            id: "0689994d-b3cd-4269-87c6-1e82babbd150",
            title: "Staying sane in your first week at InsuraCare",
            subtitle: "A guide to the ins and outs of the most medium insurance company in Incrediville",
            agenda: `Bacon ipsum dolor amet sausage turducken cow buffalo id, shoulder est pork belly adipisicing salami ball tip. Aute ut ad ullamco ut. Shankle eiusmod veniam aliqua hamburger. Pork belly boudin sunt ullamco hamburger non, aliquip swine jowl ipsum.`,
            rooms: [
                {
                    id: "425db9e4-7f71-4bb6-8854-08f36381390f",
                    name: "John's Group",
                    participants: [],
                    startTime: Date.UTC(2019, 0, 15, 12),
                    endTime: Date.UTC(2019, 0, 15, 13),
                },
                {
                    id: "6f907004-48a1-4ac7-839e-34a58a25b549",
                    name: "Jacob's Group",
                    participants: [],
                    startTime: Date.UTC(2019, 0, 15, 16),
                },
                {
                    id: "05c2d591-798a-4202-a35f-377bcb216115",
                    name: "Jingleheimer-Schmidt's Group",
                    participants: [],
                    startTime: Date.UTC(2019, 0, 15, 12),
                    endTime: Date.UTC(2019, 0, 15, 13),
                }
            ]
        },
        {
            id: "933cc4ec-7133-49a0-a894-b6e8b6aa651d",
            title: "The ACME Way",
            subtitle: "How to employ a productivity-first approach to helping Wile E. catch that darned road runner once and for all.",
            agenda: `Bacon ipsum dolor amet sausage turducken cow buffalo id, shoulder est pork belly adipisicing salami ball tip. Aute ut ad ullamco ut. Shankle eiusmod veniam aliqua hamburger. Pork belly boudin sunt ullamco hamburger non, aliquip swine jowl ipsum.`,
            rooms: [
                {
                    id: "e9a768a0-0411-44b3-876f-75a771795304",
                    name: "Section 1",
                    participants: [],
                    startTime: Date.UTC(2019, 0, 15, 12),
                    endTime: Date.UTC(2019, 0, 15, 13),
                },
                {
                    id: "95d8ebba-cb23-4626-bae5-0442ec25babb",
                    name: "Section 2",
                    participants: [],
                    startTime: Date.UTC(2019, 0, 15, 16),
                },
            ]
        },
        {
            id: "8487f158-8ef0-40d2-b4a4-1107d92004b3",
            title: "Cyberdyne Project Management Seminar",
            subtitle: "How YOU can build the next Skynet!",
            agenda: `Bacon ipsum dolor amet sausage turducken cow buffalo id, shoulder est pork belly adipisicing salami ball tip. Aute ut ad ullamco ut. Shankle eiusmod veniam aliqua hamburger. Pork belly boudin sunt ullamco hamburger non, aliquip swine jowl ipsum.`,
            rooms: [
                {
                    id: "f6823c6e-4da7-4000-adc7-71e8cc1e25d4",
                    name: "Matt Smith's group",
                    participants: [],
                    startTime: Date.UTC(2019, 0, 30, 12),
                    endTime: Date.UTC(2019, 0, 30, 13),
                },
            ]
        },
    ];

    public getDiscussions(): Promise<Discussion[]> {
        return Promise.resolve(this.DUMMY_DISCUSSIONS);
    }
}