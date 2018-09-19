import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { Discussion } from '../../models/discussion';
import { Room } from '../../models/room';

import { AuthProvider } from '../../providers/provider-auth';
import { DiscussionsProvider } from '../../providers/provider-discussions';
import { RoomRecommendationProvider } from '../../providers/provider-room-recommendation';

import './discussion.css';

const styles = (theme: Theme) => createStyles({
    selectedListItem: {
        backgroundColor: `${theme.palette.primary.main} !important`,
        color: `${theme.palette.primary.contrastText} !important`,
        'span': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.primary.contrastText} !important`,
        }
    },
});

interface DiscussionProps extends RouteComponentProps<any, any> { 
    classes: Record<string, any>;
}

interface DiscussionState {
    discussion?: Discussion;
    recommendedRoom?: Room;
    selectedGender: string;
}

class DiscussionComponent extends React.Component<DiscussionProps, DiscussionState> {
    private _authProvider = new AuthProvider();
    private _discussionsProvider = new DiscussionsProvider();
    private _roomRecommendationProvider = new RoomRecommendationProvider();

    constructor(props: DiscussionProps) {
        super(props);

        this.state = { 
            discussion: undefined, 
            recommendedRoom: undefined,
            selectedGender: 'other',
        };
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

        // TODO: not this
        const trait = {
            name: 'gender',
            possibleValues: ['male', 'female', 'other'],
        };

        const currentUser = this._authProvider.getCurrentUser();
        console.log('current user', currentUser);
        const roomRecommendations = await this
            ._roomRecommendationProvider
            .recommendRooms(
                discussion!.rooms, 
                this._authProvider.getCurrentUser()!, trait
            );

        if (roomRecommendations.length) {
            this.setState({ recommendedRoom: roomRecommendations[0] });
        }
    }

    public render() {
        if (!this.state.discussion) {
            return null;
        }

        // compose the list of traits that this discussion cares about
        let traitsList: JSX.Element[] = [];
        this.state.discussion.traits.forEach(t => {
            traitsList.push(<strong key={t}>{t}</strong>);
            traitsList.push(<span> key={`${t}-comma`}, </span>);
        });

        // remove the last comma
        if (traitsList.length) {
            traitsList.pop();
        }

        // resolve the id of the recommended room if there is one
        let recommendedRoom: Room | null = null;
        let recommendedRoomStartTime: Date | null = null;

        if (this.state.recommendedRoom) {
            recommendedRoom = this.state.recommendedRoom;
            recommendedRoomStartTime = new Date(recommendedRoom.startTime);
        }

        // build recommended room tile 
        let recommendedRoomTile: JSX.Element | null = null;
        if (recommendedRoom && recommendedRoomStartTime) {
            recommendedRoomTile = (
                <div className="recommended-room-tile-container">
                    <Typography variant="display1">Recommended room</Typography>
                    <List>
                        <ListItem className={this.props.classes.selectedListItem} selected={true}>
                            <ListItemText primary={recommendedRoom.name} secondary={`${recommendedRoomStartTime.toLocaleDateString()} @ ${recommendedRoomStartTime.toLocaleTimeString()}`} />
                        </ListItem>
                    </List>
                </div>
            );
        }

        return (
            <div className="discussion-component">
                <div className="titles">
                    <Typography variant="display2">{this.state.discussion.title}</Typography>
                    <Typography variant="subheading">{this.state.discussion.subtitle}</Typography>
                    <Typography variant="body1" className="agenda">{this.state.discussion.agenda}</Typography>
                </div>

                <div className="traits-container">
                    <Typography className="recommendation-copy" variant="body1">
                        When we recommend rooms, we choose a room that's perfect for you so your unique perspective and voice will be heard. This also causes each discussion to have as wide a range of viewpoints as possible.
                    </Typography>
                    <Typography variant="body1">This discussion recommends rooms based on your {traitsList}.</Typography>

                    {/* this will ultimately need to be somewhat dynamic, but i'm hard coding gender for demonstrative purposes */}
                    <Select placeholder="Select the gender with which you identify" value={this.state.selectedGender} />

                </div>

                <div className="rooms-container">
                    {recommendedRoomTile}
                    <Typography variant="display1">All rooms</Typography>
                    <List>
                        {this.state.discussion.rooms.map(room => {
                            const startTime = new Date(room.startTime);

                            return (
                                <ListItem
                                    className={!!recommendedRoom && room.id === recommendedRoom.id ? this.props.classes.selectedListItem : ""}
                                    key={room.id}
                                    selected={!!recommendedRoom && room.id === recommendedRoom.id}>
                                    <ListItemText primary={room.name} secondary={`${startTime.toLocaleDateString()} @ ${startTime.toLocaleTimeString()}`} />
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(styles, { withTheme: true })(DiscussionComponent));