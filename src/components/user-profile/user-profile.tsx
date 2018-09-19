import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    Avatar,
    Button,
    TextField,
} from '@material-ui/core';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/provider-auth';
import PageHeader from '../page-header/page-header';

interface UserProfileProps extends RouteComponentProps<any, any> { }
interface UserProfileState {
    user: User | null;
}

class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
    private _authProvider = new AuthProvider();

    constructor(props: UserProfileProps) {
        super(props);

        this.state = { user: null };
    }

    public async componentDidMount() {
        const currentUser = this._authProvider.getCurrentUser();
        if (!currentUser) {
            this.props.history.push('/404');
            return;
        }

        this.setState({ user: currentUser });
    }

    public render() {
        if (!this.state.user) { return null; }

        return (
            <div className="user-profile-component">
                <PageHeader title="Your profile" subtitle="All about you" />

                <div>
                    <Avatar
                        alt={this.state.user.displayName!}
                        src={this.state.user.avatarUrl!}
                        style={{ width: '128px', height: '128px' }} />
                    <TextField
                        fullWidth
                        label="Your name"
                        value={this.state.user.displayName!} />

                    <TextField
                        disabled
                        fullWidth
                        label="Your email"
                        value={this.state.user.email!} />
                </div>

                <Button variant="raised" color="primary">Save</Button>
            </div>
        );
    }
}

export default withRouter(UserProfile);