import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';
import { Discussion } from '../../models/discussion';
import { DiscussionsProvider } from '../../providers/provider-discussions';
import './discussion.css';

interface DiscussionProps extends RouteComponentProps<any, any> { }

interface DiscussionState {
    discussion?: Discussion;
}

class DiscussionComponent extends React.Component<DiscussionProps, DiscussionState> {
    private _discussionsProvider = new DiscussionsProvider();

    constructor(props: DiscussionProps) {
        super(props);

        this.state = { discussion: undefined };
    }

    // tslint:disable
    public async componentDidMount() {
        const discussion = await this._discussionsProvider.getDiscussion(this.props.match.params.discussionId);

        if (!discussion) {
            this.props.history.push('/404');
        }
        else {
            this.setState({ discussion });
        }
    }

    public render() {
        if (!this.state.discussion) {
            return null;
        }

        let traitsCopy = "This discussion cares about your ";
        this.state.discussion.traits.forEach(t => {
            traitsCopy += `${t}, `;
        });
        traitsCopy = traitsCopy.substring(0, traitsCopy.length - 2) + ".";

        return (
            <div className="discussion-component">
                <div className="titles">
                    <Typography variant="display2">{this.state.discussion.title}</Typography>
                    <Typography variant="subheading">{this.state.discussion.subtitle}</Typography>
                    <Typography variant="body1" className="agenda">{this.state.discussion.agenda}</Typography>
                </div>

                <div className="traits-container">
                    <Typography variant="body1">
                        {traitsCopy}
                    </Typography>
                </div>
            </div>
        );
    }
}

export default withRouter(DiscussionComponent);