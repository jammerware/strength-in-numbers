import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { Discussion } from "../../models/discussion";
import { DiscussionsProvider } from '../../providers/provider-discussions';
import DiscussionCard from '../discussion-card/discussion-card';
import './component-discussions.css';

interface DiscussionsState {
    discussions: Discussion[]
}

class DiscussionsComponent extends React.Component<{}, DiscussionsState> {
    private _discussionsProvider: DiscussionsProvider;

    public constructor(props: {}) {
        super(props);

        this.state = { discussions: [] };
    }

    public async componentDidMount() {
        this._discussionsProvider = new DiscussionsProvider();
        const discussions = await this._discussionsProvider.getDiscussions();

        this.setState({ discussions });
    }

    public render() {
        return (
            <div className="component-discussions">
                <div className="titles">
                    <Typography variant="display2">Discussions</Typography>
                    <Typography variant="body1">Find a discussion that interests you and pick a time to join the conversation!</Typography>
                </div>

                <ul className="discussion-cards">
                    {this.state.discussions.map(discussion => {
                        return (
                            <li key={discussion.id}>
                                <DiscussionCard discussion={discussion} />
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default DiscussionsComponent;