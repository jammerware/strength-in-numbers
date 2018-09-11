import * as React from 'react';
import Typography from '@material-ui/core/Typography';

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
                <Typography variant="display2" noWrap>Welcome</Typography>
                <Typography variant="body1">
                    This is the landing/home page. Maybe we could have sweet hypespeak here, and maybe a preview of upcoming rooms.
                </Typography>
            </div>
        );
    }
}
