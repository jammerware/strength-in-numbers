import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import { Discussion } from '../../models/discussion';

interface DiscussionCardProps extends RouteComponentProps<any, any> {
    classes: any;
    discussion: Discussion;
}

interface DiscussionCardState {
    isAgendaDialogOpen: boolean;
}

const styles = (theme: Theme) => createStyles({
    agenda: {
        marginTop: theme.spacing.unit * 1.5,
    },
    card: {
        maxWidth: 380,
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    media: {
        height: 140,
    },
    subtitle: {
        color: theme.palette.grey["600"],
        fontSize: '0.85rem',
    },
    timeChips: {
        marginTop: '2rem',
    }
});

class DiscussionCard extends React.Component<DiscussionCardProps, DiscussionCardState> {
    constructor(props: DiscussionCardProps) {
        super(props);

        this.state = { isAgendaDialogOpen: false };
    }

    public render() {
        const { classes } = this.props;

        return (
            <div className="component-discussion-card">
                <Card className={classes.card}>
                    <CardActionArea onClick={this.handleCardClick}>
                        <CardMedia
                            className={classes.media}
                            image="https://images.pexels.com/photos/1059116/pexels-photo-1059116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                            title="Discussion"
                        />
                        <CardContent>
                            <Typography variant="headline" component="h2">{this.props.discussion.title}</Typography>
                            <Typography gutterBottom className={classes.subtitle} component="h3">{this.props.discussion.subtitle}</Typography>
                            <Typography component="p" className={classes.agenda}>{this.props.discussion.agenda}</Typography>
                            <div className={classes.timeChips}>
                                {this.props.discussion.rooms.map(room => {
                                    const date = new Date(room.startTime);
                                    return <Chip
                                        key={room.id}
                                        color="primary"
                                        className={classes.chip}
                                        label={`${date.toLocaleDateString()} @  ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
                                })}
                            </div>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary" onClick={this.handleAgendaDialogOpen}>View Agenda</Button>
                        <Button size="small" color="primary">Learn More</Button>
                    </CardActions>
                </Card>
                <Dialog
                    open={this.state.isAgendaDialogOpen}
                    TransitionComponent={Slide}
                    keepMounted
                    onClose={this.handleAgendaDialogClose}
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        {this.props.discussion.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.props.discussion.agenda}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAgendaDialogClose} color="primary">Cool</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    private handleCardClick = () => {
        this.props.history.push(`/discussions/${this.props.discussion.id}`);
    }

    private handleAgendaDialogClose = () => {
        this.setState({ isAgendaDialogOpen: false });
    }

    private handleAgendaDialogOpen = () => {
        this.setState({ isAgendaDialogOpen: true });
    }
}

export default withRouter(withStyles(styles)(DiscussionCard));