import * as React from 'react';
import * as TwilioVideo from 'twilio-video';

export default class CameraPreview extends React.Component<{}, {}> {
    private _videoElementRef = React.createRef<HTMLVideoElement>();

    private handleButtonClick = () => {
        TwilioVideo.createLocalVideoTrack().then((track: any) => {
            this._videoElementRef.current!.
            const localMediaContainer = document.getElementById('local-media');
            localMediaContainer.appendChild(track.attach());
        });
    }
}