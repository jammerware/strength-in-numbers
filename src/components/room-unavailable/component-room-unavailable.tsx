import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

interface RoomUnavailableProps extends RouteComponentProps<any> {
    roomId: string;
}

export default class RoomUnavailableComponent extends React.Component<RoomUnavailableProps, {}> {
    public render() {
        return (
            <div className="titles">
                <Typography variant="display2">Room unavailable</Typography>
                <Typography variant="body1">Oh no!</Typography>
            </div>
        )
    }
}