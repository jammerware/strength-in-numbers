import * as React from 'react';
import Typography from '@material-ui/core/Typography';

import { TwilioVideoDomProvider } from '../../providers/provider-twilio-video-dom';
import './participant-card.css';

interface ParticipantCardProps {
    participant: any;
    room: any;
}

// tslint:disable
export default class ParticipantCard extends React.Component<ParticipantCardProps, {}> {
    private _twilioVideoDomProvider = new TwilioVideoDomProvider();
    private _videoContainerRef = React.createRef<HTMLDivElement>();

    constructor(props: ParticipantCardProps) {
        super(props);
    }

    public componentDidMount() {
        this.props.participant.on('trackStarted', (track: any) => {
            this._twilioVideoDomProvider.attachTrack(track, this._videoContainerRef.current);
        });
    }

    public render() {
        if (!this.props.participant) { return null; }

        return (
            <div className="participant-card-component">
                <div className="video-container" ref={this._videoContainerRef} />
                <Typography variant="body1">{this.props.participant.identity}</Typography>
            </div>
        );
    }
}