import * as React from 'react';
import { AuthProvider } from '../../providers/provider-auth';

export class LoginComponent extends React.Component<{}, {}> {
    private authProvider = new AuthProvider();

    public componentDidMount() {
        if (!this.authProvider.getCurrentUser()) {
            this.authProvider.startAuthWithSelector('#login-container');
        }
    }

    public render() {
        return (
            <div className="login-component">
                <div id="login-container" />
            </div>
        );
    }
}