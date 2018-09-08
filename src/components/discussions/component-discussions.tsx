import * as React from 'react';
import Typography from '@material-ui/core/Typography';

class DiscussionsComponent extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="component-discussions">
                <Typography variant="display2">Discussions</Typography>
                <Typography variant="body1">Find a discussion that interests you and pick a time to join the conversation!</Typography>
            </div>
        )
    }
}

export default DiscussionsComponent;