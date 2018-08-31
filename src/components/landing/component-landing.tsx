import * as React from 'react';

export class LandingComponent extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);

        this.state = {
            rooms: []
        };
    }

    public render() {
        return (
            <div className="landing-component-wrapper">
                <h1>Welcome!</h1>
                <p>This is the landing/home page. Maybe we could have sweet hypespeak here, and maybe a preview of upcoming rooms.</p>
            </div>
        );
    }
}
