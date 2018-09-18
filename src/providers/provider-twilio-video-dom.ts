// tslint:disable
export class TwilioVideoDomProvider {
    public attachTrack(track: any, element: HTMLDivElement | null) {
        if (!element) {
            throw new Error("Attempted to attach tracks to a null element.");
        }

        element.appendChild(track.attach());
    }
}