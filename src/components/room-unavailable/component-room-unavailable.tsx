import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { Room } from '../../models/room';
import { RoomEntryValidationProvider } from '../../providers/provider-room-entry-validation';
import { DiscussionsProvider } from '../../providers/provider-discussions';

interface RoomUnavailableProps extends RouteComponentProps<any> {
    roomId: string;
}

interface RoomUnavailableState {
    canEnterRoom: boolean;
    roomExists: boolean;
    room?: Room;
}

export default class RoomUnavailableComponent extends React.Component<RoomUnavailableProps, RoomUnavailableState> {
    private _discussionsProvider = new DiscussionsProvider();
    private _roomEntryValidationProvider = new RoomEntryValidationProvider(this._discussionsProvider);

    constructor(props: RoomUnavailableProps) {
        super(props);

        this.state = {
            canEnterRoom: false,
            roomExists: false,
            room: undefined
        };
    }

    public async componentDidMount() {
        this.setState({ room: await this._discussionsProvider.getRoom(this.props.roomId) });

        if (await this._roomEntryValidationProvider.getRoomExists(this.props.roomId)) {
            this.setState({ roomExists: true });
        }

        if (await this._roomEntryValidationProvider.canEnterRoom(Date.now(), this.props.roomId)) {
            this.setState({ canEnterRoom: true });
        }
    }

    public render() {
        let message: string = "";
        if (!this.state.roomExists) {
            message = "Sorry - you seem to have taken a wrong turn! This room doesn't exist, as far as we can tell.";
        }
        else if (!this.state.canEnterRoom) {
            message = "This room isn't open right now. You can enter a room for discussion up to 15 minutes before it starts and up to an hour after it's started.";
        }

        return (
            <div className="component-room-unavailable">
                <div className="titles">
                    <Typography variant="display2">Room unavailable</Typography>
                    <Typography variant="body2">Oh no!</Typography>
                </div>

                <div className="message" style={{ marginTop: '2rem' }}>
                    <Typography variant="body1">{message}</Typography>
                </div>
            </div>
        )
    }
}