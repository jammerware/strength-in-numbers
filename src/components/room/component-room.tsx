import * as React from 'react';
import * as Video from 'twilio-video';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { TwilioApiProvider } from '../../providers/provider-twilio-api';
import { DiscussionsProvider } from '../../providers/provider-discussions';
import { RoomEntryValidationProvider } from '../../providers/provider-room-entry-validation';
import { Room } from '../../models/room';
import HelpWithMisconduct from '../help-with-misconduct/component-help-with-misconduct';
import RoomChat from '../room-chat/room-chat';
import RoomConnectDisconnect from '../room-connect-disconnect/room-connect-disconnect';

import './component-room.css';

interface RoomProps extends RouteComponentProps<any> { }

interface RoomState {
    accessToken: string | null;
    connectedToRoom?: any;
    identity: string;
    isConnected: boolean;
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
            isConnected: false,
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

        let localMediaStyle: React.CSSProperties = { display: "block" };
        if (!this.state.connectedToRoom) {
            localMediaStyle = { display: "none" };
        }

        let roomChatWidget = null;
        if (this.state.isConnected && this.state.room.id && this.state.identity) {
            roomChatWidget = (<RoomChat roomId={this.state.room.id} userId={this.state.identity} />);
        }
        else {
            roomChatWidget = <Typography variant="body1">Enter your name and connect to join the conversation!</Typography>
        }

        return (
            <div className="room-component">
                <Grid container spacing={16}>
                    <Grid item xs={8}>
                        <div>
                            <h2>You</h2>
                            <div ref={this.localParticipantMediaRef} style={localMediaStyle} />

                            <h2>Other people</h2>
                            <div className="remote-participants-wrapper" ref={this.remoteMediaRef} />
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <ExpansionPanel defaultExpanded>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="button" color="primary">Your camera</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <RoomConnectDisconnect
                                    onConnect={this.handleConnect}
                                    onDisconnect={this.handleDisconnect}
                                    onNameChange={this.handleNameChange} />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel defaultExpanded>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="button" color="primary">Connect</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <RoomConnectDisconnect
                                    onConnect={this.handleConnect}
                                    onDisconnect={this.handleDisconnect}
                                    onNameChange={this.handleNameChange} />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel defaultExpanded>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="button" color="primary">Chat</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                {roomChatWidget}
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <div>
                            <HelpWithMisconduct room={this.state.room} />
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }

    // TODO: abstract to service - there's way too much twilio stuff in here
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
            .connect(this.state.accessToken, { name: roomId, dominantSpeaker: true })
            .then((room: any) => {
                this.setState({ connectedToRoom: room });
                this.attachParticipantTracks(room.localParticipant, this.localParticipantMediaRef);

                // attach tracks for all existing participants
                room.participants.forEach((participant: any) => {
                    console.log('Already in room', participant.identity);
                    this.attachParticipantTracks(participant, this.remoteMediaRef);
                });

                room.on('dominantSpeakerChanged', (event: any) => {
                    console.log('dominant speaker', event);
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

        this.setState({ isConnected: true });
    };

    private handleDisconnect = async () => {
        if (this.state.connectedToRoom) {
            this.state.connectedToRoom.disconnect();
            this.setState({ connectedToRoom: null });
        }
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ identity: event.target.value });
    }
}

const RoomComponent = withRouter(RoomComponentWithoutRouter);
export { RoomComponent }