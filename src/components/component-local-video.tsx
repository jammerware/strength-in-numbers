import * as React from 'react';
import * as Video from 'twilio-video';
import { TwilioApiProvider } from '../providers/provider-twilio-api';

interface LocalVideoState {
    accessToken: string | null;
    identity: string;
    roomName: string;

    connectedToRoom: any;
}

export class LocalVideoComponent extends React.Component<{}, LocalVideoState> {
    private twilioApi = new TwilioApiProvider();
    private localParticipantMediaRef = React.createRef<HTMLDivElement>();
    private remoteMediaRef = React.createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);

        this.state = {
            identity: "ben",
            accessToken: null,
            roomName: "friends",

            connectedToRoom: null,
        };
    }

    public render() {
        let tokenBlock = <span>No token yet.</span>
        if (this.state.accessToken) {
            tokenBlock = <span>{this.state.accessToken}</span>;
        }

        return (
            <div className="local-video-component">
                <p>
                    <strong>Token: </strong>
                    {tokenBlock}
                </p>

                <h2>You</h2>
                <div ref={this.localParticipantMediaRef} />

                <h2>Other people</h2>
                <div ref={this.remoteMediaRef} />

                <input type="text" value={this.state.identity} onChange={this.handleNameChange} />
                <button onClick={this.handleConnect}>Connect</button>
                <button onClick={this.handleDisconnect}>Disconnect</button>
            </div>
        );
    }

    // Attach the Participant's Tracks to the DOM.
    private attachParticipantTracks(participant: any, container: React.RefObject<HTMLDivElement>) {
        const tracks = Array.from(participant.tracks.values());

        tracks.forEach((track: any) => {
            if (container.current) {
                container.current.appendChild(track.attach());
            }
        });
    }

    private handleConnect = async () => {
        const token = await this.twilioApi.getToken(this.state.identity, this.state.roomName);
        this.setState({ accessToken: token });

        Video
            .connect(this.state.accessToken, { name: this.state.roomName })
            .then((room: any) => {
                this.setState({ connectedToRoom: room });
                this.attachParticipantTracks(room.localParticipant, this.localParticipantMediaRef);

                // attach tracks for all existing participants
                // tslint:disable
                room.participants.forEach((participant: any) => {
                    console.log("Already in Room: '" + participant.identity + "'");
                    this.attachParticipantTracks(participant, this.remoteMediaRef);
                });

                // handle room events
                room.on('participantConnected', (participant: any) => {
                    console.log("Joining: '" + participant.identity + "'");
                });
            });
    };

    private handleDisconnect = () => {
        if (this.state.connectedToRoom) {
            this.state.connectedToRoom.disconnect();
        }
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ identity: event.target.value })
    }
}
