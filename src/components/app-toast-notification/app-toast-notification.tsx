import * as React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';

interface AppToastNotificationProps {
    buttonText: string;
    handleClose: () => void;
    isOpen: boolean;
    message: string;
}

export default class AppToastNotification extends React.Component<AppToastNotificationProps, {}> {
    constructor(props: AppToastNotificationProps) {
        super(props);

        this.state = { isOpen: this.props.isOpen };
    }

    public render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.props.isOpen}
                onClose={this.props.handleClose}
                autoHideDuration={6000}
                ContentProps={{ 'aria-describedby': 'message-id' }}
                message={<span id="message-id">{this.props.message}</span>}
                action={[
                    <Button
                        color="secondary"
                        key="dismiss"
                        onClick={this.props.handleClose}>{this.props.buttonText}</Button>,
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit">
                        <CloseIcon onClick={this.props.handleClose} />
                    </IconButton>,
                ]}
            />
        );
    }
}