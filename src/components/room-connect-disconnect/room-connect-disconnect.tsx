import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

interface RoomConnectDisconnectProps {
    onConnect: (participantName: string) => Promise<void>;
    onDisconnect: () => Promise<void>;
    onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface RoomConnectDisconnectState {
    isConnected: boolean;
    name: string;
}

export default class RoomConnectDisconnect extends React.Component<RoomConnectDisconnectProps, RoomConnectDisconnectState> {
    constructor(props: RoomConnectDisconnectProps) {
        super(props);

        this.state = { isConnected: false, name: '' };
    }

    public render() {
        return (
            <div>
                {this.state.isConnected &&
                    <Typography variant="body2">You're connected!</Typography>
                }
                <Grid container spacing={8}>
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            onChange={this.handleNameChange}
                            placeholder="What should people call you?" />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            color="primary"
                            onClick={this.handleClick}
                            variant="raised">{this.state.isConnected ? 'Disconnect' : 'Connect'}</Button>
                    </Grid>
                </Grid>
            </div>
        );
    }

    private handleClick = () => {
        this.props.onConnect(this.state.name);
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onNameChange(event);
    }
}