import * as React from 'react';
import { Client } from 'twilio-chat';
import { Channel } from 'twilio-chat/lib/channel'
import { Message } from 'twilio-chat/lib/message';
import { createStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
    messageList: Message[];
}

const styles = (theme: Theme) => createStyles({
    messageControls: {
        display: 'flex',
    },
    messageLog: {
        border: `solid 1px ${theme.palette.primary.main}`,
        boxShadow: `0 0 10px #888888`,
        height: theme.spacing.unit * 40,
        marginBottom: theme.spacing.unit * 2,
        overflowY: "auto",
        width: "100%"
    },
    messageText: {
        flexGrow: 1,
        marginRight: theme.spacing.unit * 2,
    },
    root: {
        width: '100%',
    }
});

// tslint:disable
class RoomChat extends React.Component<RoomChatProps, RoomChatState> {
    private _messageTextFieldRef = React.createRef<HTMLInputElement>();
    private _twilioChatClient: Client;
    private _roomChannel: Channel;

    constructor(props: RoomChatProps) {
        super(props);

        this.state = { messageText: '', messageList: [] };
    }

    public async componentDidMount() {
        const twilioApi = new TwilioApiProvider();
        this._twilioChatClient = await twilioApi.getChatClient(this.props.userId, this.props.roomId);

        // focus on mount - this may be bold
        this._messageTextFieldRef.current!.focus();

        // create or get the existing room
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

        // connect the participant to the room if need be
        const channelMembers = await this._roomChannel.getMembers();
        if (!channelMembers.find(m => m.identity === this.props.userId)) {
            await this._roomChannel.join();
        }

        // wire up the events we're going to listen to on the channel
        this.wireUpChannelEvents(this._roomChannel);
    }

    public async componentWillUnmount() {
        if (this._roomChannel) {
            await this._roomChannel.leave();
        }

        if (this._twilioChatClient && this._twilioChatClient.connectionState !== "disconnected") {
            await this._twilioChatClient.shutdown();
        }
    }

    public render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.messageLog}>
                    <List>
                        {this.state.messageList.map(message => {
                            return (
                                <ListItem key={message.sid}>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                    <ListItemText primary={message.body} secondary={`${message.author} @ ${message.timestamp.toLocaleTimeString()}`}></ListItemText>
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
                <div className={classes.messageControls}>
                    <TextField
                        className={classes.messageText}
                        fullWidth
                        onChange={this.handleTextChange}
                        placeholder="What do you want to say?"
                        inputRef={this._messageTextFieldRef}
                        value={this.state.messageText} />
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

    private handleSendButtonClick = async () => {
        const message = this.state.messageText;

        // TODO: abstract into service
        await this._roomChannel.sendMessage(message);
        this.setState({ messageText: '' });
    }

    private wireUpChannelEvents(channel: Channel) {
        channel.on('messageAdded', this.onMessageAdded.bind(this));
    }

    private onMessageAdded(message: Message) {
        const { messageList } = this.state;
        messageList.push(message);
        this.forceUpdate();
        this._messageTextFieldRef.current!.focus();
    }
}

export default withStyles(styles, { withTheme: true })(RoomChat);