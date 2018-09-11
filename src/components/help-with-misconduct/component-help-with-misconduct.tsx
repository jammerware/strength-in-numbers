import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { Room } from '../../models/room';
import { AppEmailNotificationsProvider } from '../../providers/provider-app-email-notifications';
import { AppEmailNotificationType } from '../../models/app-email-notification';
import AppToastNotification from '../app-toast-notification/app-toast-notification';

interface HelpWithMisconductProps {
    room: Room;
}

interface HelpWithMisconductState {
    isDialogOpen: boolean;
    isNotificationShown: boolean;
    messageText: string;
}

export default class HelpWithMisconductComponent extends React.Component<HelpWithMisconductProps, HelpWithMisconductState> {
    private _appEmailNotificationsProvider = new AppEmailNotificationsProvider();

    constructor(props: HelpWithMisconductProps) {
        super(props);

        this.state = {
            isDialogOpen: false,
            isNotificationShown: false,
            messageText: '',
        };
    }

    public render() {
        return (
            <div className="component-help-with-misconduct">
                <Dialog
                    open={this.state.isDialogOpen}
                    TransitionComponent={Slide}
                    keepMounted
                    onClose={this.handleDialogClose}
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">Discussion not going well?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Everyone has bad days, and we're not always at our best. If your discussion is being negatively
                            impacted by misconduct, let us know here, and we'll look into it. Thanks for providing your feedback!
                        </DialogContentText>
                        <TextField
                            autoFocus
                            fullWidth
                            multiline
                            onChange={this.handleMessageChange}
                            placeholder="Describe what went wrong during your discussion"
                            rows="4"
                            style={{ marginTop: '2rem' }} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose}>Cancel</Button>
                        <Button onClick={this.handleSubmit} color="primary" variant="contained">Submit</Button>
                    </DialogActions>
                </Dialog>
                <AppToastNotification
                    buttonText="OK"
                    handleClose={this.handleNotificationClose}
                    isOpen={this.state.isNotificationShown}
                    message="We'll look into it. Thanks for your feedback!" />
                <Button color="primary" onClick={this.handleDialogOpen}>Help with misconduct</Button>
            </div >
        );
    }

    private handleDialogClose = () => {
        this.setState({ isDialogOpen: false });
    }

    private handleDialogOpen = () => {
        this.setState({ isDialogOpen: true });
    }

    private handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ messageText: event.target.value });
    }

    private handleNotificationClose = () => {
        this.setState({ isNotificationShown: false });
    }

    private handleSubmit = () => {
        this._appEmailNotificationsProvider.send({
            subject: `Misconduct report | Room ${this.props.room.id}`,
            body: `A participant reported misconduct in the room.\n\n${this.state.messageText}`,
            type: AppEmailNotificationType.REPORT_MISCONDUCT
        });

        this.setState({ isDialogOpen: false, isNotificationShown: true });
    }
}