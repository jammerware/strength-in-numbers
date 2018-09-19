import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

interface RoomConnectDisconnectProps {
    onConnect: () => Promise<void>;
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
                <Grid container spacing={8}>
                    <Grid item xs={10}>
                        <TextField
                            disabled={this.state.isConnected}
                            fullWidth
                            onChange={this.handleNameChange}
                            placeholder="What should people call you?" />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            color={this.state.isConnected ? "secondary" : "primary"}
                            disabled={!this.state.name}
                            onClick={this.handleClick}
                            variant="raised">{this.state.isConnected ? 'Disconnect' : 'Connect'}</Button>
                    </Grid>
                </Grid>
            </div>
        );
    }

    private handleClick = async () => {
        if (this.state.isConnected) {
            this.setState({ isConnected: false });
            await this.props.onDisconnect();
        }
        else {
            this.setState({ isConnected: true });
            await this.props.onConnect();
        }
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onNameChange(event);
        this.setState({ name: event.target.value });
    }
}