import * as React from 'react';
import * as Video from 'twilio-video';
import { TwilioApiProvider } from '../../providers/provider-twilio-api';
import './component-local-video.css';

// tslint:disable
interface LocalVideoState {
    accessToken: string | null;
    identity: string;
    roomName: string;

    connectedToRoom?: any;
}

export class LocalVideoComponent extends React.Component<{}, LocalVideoState> {
    private twilioApi = new TwilioApiProvider();
    private localParticipantMediaRef = React.createRef<HTMLDivElement>();
    private remoteMediaRef = React.createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);

        this.state = {
            identity: "",
            accessToken: null,
            roomName: "friends",
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
                <div className="remote-participants-wrapper" ref={this.remoteMediaRef} />

                <input type="text" autoFocus value={this.state.identity} onChange={this.handleNameChange} />
                <button onClick={this.handleConnect}>Connect</button>
                <button onClick={this.handleDisconnect}>Disconnect</button>
            </div>
        );
    }

    // Attach the Participant's Tracks to the DOM.
    private attachParticipantTracks(participant: any, container: React.RefObject<HTMLDivElement>) {
        console.log(`Connecting tracks for`, participant);
        const tracks = Array.from(participant.tracks.values());
        this.attachTracks(tracks, container);
    }

    private attachTracks(tracks: any[], container: React.RefObject<HTMLDivElement>) {
        tracks.forEach((track: any, key: any) => {
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
                room.participants.forEach((participant: any) => {
                    console.log("Already in room", participant);
                    this.attachParticipantTracks(participant, this.remoteMediaRef);
                });

                // handle room events
                room.on('participantConnected', (participant: any) => {
                    console.log('Joined', participant);
                    this.attachParticipantTracks(participant, this.remoteMediaRef);
                });

                room.on('trackAdded', (track: any, participant: any) => {
                    console.log(participant.identity + " added track: " + track.kind);
                    this.attachTracks([track], this.remoteMediaRef);
                });
            });
    };

    private handleDisconnect = () => {
        if (this.state.connectedToRoom) {
            this.state.connectedToRoom.disconnect();
        }
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ identity: event.target.value });
    }
}
