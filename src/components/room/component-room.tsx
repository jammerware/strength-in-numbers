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
import { Discussion } from '../../models/discussion';
import { Room } from '../../models/room';
import CameraPreview from '../camera-preview/camera-preview';
import HelpWithMisconduct from '../help-with-misconduct/component-help-with-misconduct';
import ParticipantCard from '../participant-card/participant-card';
import RoomChat from '../room-chat/room-chat';
import RoomConnectDisconnect from '../room-connect-disconnect/room-connect-disconnect';

import './component-room.css';

interface RoomProps extends RouteComponentProps<any> { }

interface RoomState {
    accessToken: string | null;
    connectedToRoom?: any;
    discussion?: Discussion;
    identity: string;
    isConnected: boolean;
    otherParticipants: any[];
    room?: Room;
}

// tslint:disable
class RoomComponentWithoutRouter extends React.Component<RoomProps, RoomState> {
    private _discussionsProvider = new DiscussionsProvider();
    private _remoteMediaRef = React.createRef<HTMLDivElement>();
    private _roomEntryValidationProvider = new RoomEntryValidationProvider(this._discussionsProvider);
    private _twilioApi = new TwilioApiProvider();

    constructor(props: any) {
        super(props);

        this.state = {
            identity: "",
            isConnected: false,
            accessToken: null,
            otherParticipants: [],
        };
    }

    public async componentDidMount() {
        const roomId = this.props.match.params.roomId as string;

        if (!await this._roomEntryValidationProvider.getRoomExists(roomId)) {
            this.props.history.push('/404');
            return;
        }

        if (!await this._roomEntryValidationProvider.canEnterRoom(Date.now(), roomId)) {
            this.props.history.push(`/rooms/${roomId}/unavailable`);
            return;
        }

        const discussion = await this._discussionsProvider.getDiscussionForRoom(roomId);
        const room = await this._discussionsProvider.getRoom(roomId);
        this.setState({ discussion, room });
    }

    public render() {
        if (!this.state.room || !this.state.discussion) { return null; }

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
                        <div className="layout">
                            <div className="title-stuff">
                                <Typography variant="display2">{this.state.discussion.title}</Typography>
                                <Typography variant="subheading">{this.state.discussion.subtitle}</Typography>
                            </div>
                            <div className="dominant-speaker-container">
                                
                            </div>
                            <div className="remote-participants-drawer">
                                <h2>Other people</h2>
                                {this.state.otherParticipants.map(p => {
                                    return (<ParticipantCard key={p.identity} />);
                                })}
                                <div className="remote-participants-wrapper" ref={this._remoteMediaRef} />
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
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
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="button" color="primary">Your camera</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <CameraPreview />
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

    private addParticipant(participant: any) {
        console.log('adding participant', participant.identity);
        this.attachParticipantTracks(participant, this._remoteMediaRef);
        this.state.otherParticipants.push(participant);
        this.forceUpdate();
    }

    private handleConnect = async () => {
        const roomId = this.props.match.params.roomId;
        const token = await this._twilioApi.getToken(this.state.identity, roomId);
        this.setState({ accessToken: token });

        Video
            .connect(this.state.accessToken, { name: roomId, dominantSpeaker: true })
            .then((room: any) => {
                this.setState({ connectedToRoom: room });
               
                // attach tracks for all existing participants
                room.participants.forEach((participant: any) => {
                    this.addParticipant(participant);
                });

                room.on('dominantSpeakerChanged', (event: any) => {
                    console.log('dominant speaker', event);
                });

                // handle room events
                room.on('participantConnected', (participant: any) => {
                    console.log('Joined', participant);
                    this.addParticipant(participant);
                });

                room.on('trackAdded', (track: any, participant: any) => {
                    this.attachTracks([track], this._remoteMediaRef);
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
export { RoomComponent };