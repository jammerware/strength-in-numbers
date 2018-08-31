import * as React from 'react';

interface RoomsState {
    rooms: any[]
}

export class RoomsComponent extends React.Component<{}, RoomsState> {
    public render() {
        return (
            <div className="rooms-component-wrapper">
                <h1>Rooms</h1>
                <p>This is where we'll list the scheduled rooms, their start times, and maybe a snippet of their agenda.</p>
            </div>
        );
    }
}