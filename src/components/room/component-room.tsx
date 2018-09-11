import * as React from 'react';
import * as Video from 'twilio-video';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TwilioApiProvider } from '../../providers/provider-twilio-api';
import { DiscussionsProvider } from '../../providers/provider-discussions';
import { RoomEntryValidationProvider } from '../../providers/provider-room-entry-validation';
import { Room } from '../../models/room';
import HelpWithMisconduct from '../help-with-misconduct/component-help-with-misconduct';

import './component-room.css';

interface RoomProps extends RouteComponentProps<any> { }

interface RoomState {
    accessToken: string | null;
    connectedToRoom?: any;
    identity: string;
    room?: Room;
}

// tslint:disable
class RoomComponentWithoutRouter extends React.Component<RoomProps, RoomState> {
    private discussionsProvider = new DiscussionsProvider();
    private roomEntryValidationProvider = new RoomEntryValidationProvider(this.discussionsProvider);
    private twilioApi = new TwilioApiProvider();
    private localParticipantMediaRef = React.createRef<HTMLDivElement>();
    private remoteMediaRef = React.createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);

        this.state = {
            identity: "",
            accessToken: null,
        };
    }

    public async componentDidMount() {
        const roomId = this.props.match.params.roomId as string;

        if (!await this.roomEntryValidationProvider.getRoomExists(roomId)) {
            this.props.history.push('/404');
            return;
        }

        if (!await this.roomEntryValidationProvider.canEnterRoom(Date.now(), roomId)) {
            this.props.history.push(`/rooms/${roomId}/unavailable`);
            return;
        }

        this.setState({ room: await this.discussionsProvider.getRoom(roomId) });
    }

    public render() {
        if (!this.state.room) { return null; }

        let tokenBlock = <span>No token yet.</span>
        if (this.state.accessToken) {
            tokenBlock = <span>{this.state.accessToken}</span>;
        }

        return (
            <div className="room-component">
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

                <div className="help-with-misconduct">
                    <HelpWithMisconduct room={this.state.room} />
                </div>
            </div>
        );
    }

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
        const roomId = this.props.match.params.roomId;
        const token = await this.twilioApi.getToken(this.state.identity, roomId);
        this.setState({ accessToken: token });

        Video
            .connect(this.state.accessToken, { name: roomId })
            .then((room: any) => {
                this.setState({ connectedToRoom: room });
                this.attachParticipantTracks(room.localParticipant, this.localParticipantMediaRef);

                // attach tracks for all existing participants
                room.participants.forEach((participant: any) => {
                    console.log('Already in room', participant.identity);
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

const RoomComponent = withRouter(RoomComponentWithoutRouter);
export { RoomComponent }