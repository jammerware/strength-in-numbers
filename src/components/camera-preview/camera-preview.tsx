import * as React from 'react';
import * as TwilioVideo from 'twilio-video';
import Button from '@material-ui/core/Button';
import './camera-preview.css';

interface CameraPreviewState {
    isPreviewing: boolean;
}

// tslint:disable
export default class CameraPreview extends React.Component<{}, CameraPreviewState> {
    private _videoElementRef = React.createRef<HTMLDivElement>();
    private _videoTrack: any = null;

    constructor(props: {}) {
        super(props);

        this.state = { isPreviewing: false };
    }

    public render() {
        return (
            <div style={{width: '100%'}}>
                <div className="camera-preview-container" ref={this._videoElementRef} />

                <Button 
                    color={this.state.isPreviewing ? 'secondary' : 'primary'}
                    fullWidth 
                    onClick={this.handleButtonClick}
                    variant="raised">
                    {this.state.isPreviewing ? "Hide my video" : "Show my video"}
                </Button>
            </div>
        );
    }

    private handleButtonClick = () => {
        if (this.state.isPreviewing) {
            if (this._videoTrack) {
                this._videoTrack.detach().forEach((element: any) => element.remove());
            }
            this.setState({ isPreviewing: false });
        }
        else {
            TwilioVideo.createLocalVideoTrack().then((track: any) => {
                this._videoElementRef.current!.appendChild(track.attach());
                this._videoTrack = track;
                this.setState({ isPreviewing: true });
            });
        }
    }
}