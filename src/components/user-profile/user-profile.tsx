import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    Avatar,
    Button,
    createStyles,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Theme,
    withStyles,
} from '@material-ui/core';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/provider-auth';

import AppToastNotification from '../app-toast-notification/app-toast-notification';
import PageHeader from '../page-header/page-header';

interface UserProfileProps extends RouteComponentProps<any, any> { 
    classes: any;
}

interface UserProfileState {
    isNotificationShown: boolean;
    selectedGender?: string;
    user: User | null;
}

const styles = (theme: Theme) => createStyles({
    controlSpacing: {
        marginBottom: theme.spacing.unit * 4,
    }
});

class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
    private _authProvider = new AuthProvider();

    constructor(props: UserProfileProps) {
        super(props);

        this.state = { 
            isNotificationShown: false, 
            selectedGender: 'other',
            user: null 
        };
    }

    public async componentDidMount() {
        const currentUser = this._authProvider.getCurrentUser();
        if (!currentUser) {
            this.props.history.push('/404');
            return;
        }

        this.setState({ 
            selectedGender: currentUser.gender || undefined,
            user: currentUser 
        });
    }

    public render() {
        if (!this.state.user) { return null; }

        return (
            <div className="user-profile-component">
                <PageHeader title="Your profile" subtitle="All about you" />

                <div>
                    <Avatar
                        alt={this.state.user.displayName!}
                        className={this.props.classes.controlSpacing}
                        src={this.state.user.avatarUrl!}
                        style={{ width: '128px', height: '128px' }} />

                    <TextField
                        className={this.props.classes.controlSpacing}
                        fullWidth
                        label="Your name"
                        value={this.state.user.displayName!} />

                    <TextField
                        className={this.props.classes.controlSpacing}
                        disabled
                        fullWidth
                        label="Your email"
                        value={this.state.user.email!} />

                    <FormControl fullWidth className={this.props.classes.controlSpacing}>
                        <InputLabel>Your gender</InputLabel>
                        <Select onChange={this.handleGenderChange} fullWidth value={this.state.selectedGender || 'other'}>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                        </Select>
                        <FormHelperText>Select the gender with which you most identify.</FormHelperText>
                    </FormControl>
                        
                </div>

                <Button 
                    color="primary"
                    onClick={this.handleButtonClick}
                    variant="raised">Save</Button>
                <AppToastNotification
                    buttonText="OK"
                    handleClose={this.handleNotificationClose}
                    isOpen={this.state.isNotificationShown}
                    message="Your profile's been saved!" />
            </div>
        );
    }

    private handleButtonClick = () => {
        this.setState({ isNotificationShown: true });
    }

    private handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ selectedGender: event.target.value });
    }

    private handleNotificationClose = () => {
        this.setState({ isNotificationShown: false });
    }
}

export default withRouter(withStyles(styles)(UserProfile));