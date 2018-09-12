import * as React from 'react';
import { Client } from 'twilio-chat';
import { Channel } from 'twilio-chat/lib/channel'
import { createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import { TwilioApiProvider } from '../../providers/provider-twilio-api';
import { Button, withStyles } from '@material-ui/core';

interface RoomChatProps {
    roomId: string;
    userId: string;
    classes: any;
    theme: Theme;
}

interface RoomChatState {
    messageText: string;
}

const styles = (theme: Theme) => createStyles({
    messageControls: {
        display: 'flex',
    },
    messageLog: {
        border: `solid 1px ${theme.palette.primary.main}`,
        boxShadow: `2px 2px 2px 2px #888888`,
        height: theme.spacing.unit * 40,
        marginBottom: theme.spacing.unit * 2,
    },
    messageText: {
        flexGrow: 1,
        marginRight: theme.spacing.unit * 2,
    },
});

// tslint:disable
class RoomChat extends React.Component<RoomChatProps, RoomChatState> {
    private _twilioChatClient: Client;
    private _roomChannel: Channel;

    constructor(props: RoomChatProps) {
        super(props);

        this.state = { messageText: '' };
    }

    public async componentWillMount() {
        const twilioApi = new TwilioApiProvider();
        this._twilioChatClient = await twilioApi.getChatClient(this.props.userId, this.props.roomId);

        try {
            this._roomChannel = await this._twilioChatClient.getChannelByUniqueName(this.props.roomId);
        }
        catch (err) {
            this._roomChannel = await this._twilioChatClient.createChannel({
                friendlyName: `Room ${this.props.roomId}`,
                uniqueName: this.props.roomId
            });
        }

        if (!this._roomChannel) {
            throw new Error(`Couldn't resolve channel for room ${this.props.roomId}`)
        }

        const channelMembers = await this._roomChannel.getMembers();
        if (!channelMembers.find(m => m.identity === this.props.userId)) {
            await this._roomChannel.join();
            console.log('joined channel')
        }
        else {
            console.log('this person is already in the channel, which is nice');
        }

        this.wireUpChannelEvents(this._roomChannel);
    }

    public async componentWillUnmount() {
        console.log('unmounting and signing out');

        if (this._roomChannel) {
            await this._roomChannel.leave();
        }

        if (this._twilioChatClient && this._twilioChatClient.connectionState !== "disconnected") {
            await this._twilioChatClient.shutdown();
        }

        console.log('done');
    }

    public render() {
        const { classes } = this.props;

        return (
            <div className="component-room-chat">
                <div className={classes.messageLog}>
                </div>
                <div className={classes.messageControls}>
                    <TextField
                        className={classes.messageText}
                        fullWidth
                        onChange={this.handleTextChange}
                        placeholder="What do you want to say?" />
                    <Button
                        className={classes.sendButton}
                        color="primary"
                        disabled={!this.state.messageText}
                        variant="raised"
                        onClick={this.handleSendButtonClick}>
                        Send
                    </Button>
                </div>
            </div>
        );
    }

    private handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ messageText: event.target.value });
    }

    private handleSendButtonClick = () => {
        const message = this.state.messageText;

        // TODO: abstract into service
        console.log('Would send message', message);
        this._roomChannel.sendMessage(message);
        this.setState({ messageText: '' });
    }

    private wireUpChannelEvents(channel: Channel) {
        channel.on('message', ((message: string) => {
            console.log('message is', message);
        }));
    }
}

export default withStyles(styles, { withTheme: true })(RoomChat);