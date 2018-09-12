import * as React from 'react';
import { Client } from 'twilio-chat';
import { Channel } from 'twilio-chat/lib/channel'
import { TwilioApiProvider } from '../../providers/provider-twilio-api';

interface RoomChatProps {
    roomId: string,
    userId: string,
}


// tslint:disable
export default class RoomChat extends React.Component<RoomChatProps, {}> {
    private _twilioChatClient: Client;

    public async componentWillMount() {
        const twilioApi = new TwilioApiProvider();
        this._twilioChatClient = await twilioApi.getChatClient(this.props.userId, this.props.roomId);
        let channel: Channel | null = null;

        try {
            channel = await this._twilioChatClient.getChannelByUniqueName(this.props.roomId);
        }
        catch (err) {
            console.log('err finding channel', err);
            channel = await this._twilioChatClient.createChannel({
                friendlyName: `Room ${this.props.roomId}`,
                uniqueName: this.props.roomId
            });
        }

        if (!channel) {
            throw new Error(`Couldn't resolve channel for room ${this.props.roomId}`)
        }

        const channelMembers = await channel.getMembers();
        if (!channelMembers.find(m => m.identity === this.props.userId)) {
            console.log('got channel', channel);
            await channel.join();
            console.log('joined channel')
        }
        else {
            console.log('this person is already in the channel, which is nice');
        }
    }

    public async componentWillUnmount() {
        if (this._twilioChatClient && this._twilioChatClient.connectionState !== "disconnected") {
            await this._twilioChatClient.shutdown();
        }
    }

    public render() {
        return (
            <div className="component-room-chat">this is the room chat widget</div>
        );
    }
}