import * as React from 'react';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/core/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import InfoIcon from '@material-ui/icons/Info';
import FeaturedVideoIcon from '@material-ui/icons/FeaturedVideo';
import HomeIcon from '@material-ui/icons/Home';

import DiscussionsComponent from '../discussions/component-discussions';
import { LandingComponent } from '../landing/component-landing';
import { RoomComponent } from '../room/component-room';
import { LoginComponent } from '../login/component-login';
import DiscussionComponent from '../discussion/discussion';
import RoomUnavailableComponent from '../room-unavailable/component-room-unavailable';
import './app.css';

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        zIndex: 1,
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});

interface AppProps extends RouteComponentProps<any> {
    classes: any,
    theme: Theme
}

interface AppState {
    open: boolean;
}

class App extends React.Component<AppProps, AppState> {
    // extracted nav handlers to fields to avoid lambdas in JSX
    // see https://stackoverflow.com/questions/36677733/why-shouldnt-jsx-props-use-arrow-functions-or-bind
    private _handleNavToHome = (event: React.MouseEvent<HTMLElement>) => this.handleNavigate('/');
    private _handleNavToDiscussions = (event: React.MouseEvent<HTMLElement>) => this.handleNavigate('/discussions');
    private _handleNavToTechDemo = (event: React.MouseEvent<HTMLElement>) => this.handleNavigate('/rooms/f6823c6e-4da7-4000-adc7-71e8cc1e25d4');
    private _handleNavToAbout = (event: React.MouseEvent<HTMLElement>) => this.handleNavigate('/about');

    constructor(props: AppProps) {
        super(props);

        this.state = { open: true };
    }

    public render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
                    <Toolbar disableGutters={!this.state.open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, this.state.open && classes.hide)}>
                            <MenuIcon open={!this.state.open} />
                        </IconButton>
                        <Typography variant="title" color="inherit" noWrap>Strength in Numbers</Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                    }}
                    open={this.state.open}>
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button onClick={this._handleNavToHome}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button onClick={this._handleNavToDiscussions}>
                            <ListItemIcon>
                                <DeveloperBoardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Discussions" />
                        </ListItem>
                        <ListItem button onClick={this._handleNavToTechDemo}>
                            <ListItemIcon>
                                <FeaturedVideoIcon />
                            </ListItemIcon>
                            <ListItemText primary="Video tech demo" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={this._handleNavToAbout}>
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText primary="About" />
                        </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div className="content-container">
                        <Route path="/discussions" exact component={DiscussionsComponent} />
                        <Route path="/discussions/:discussionId" exact component={DiscussionComponent} />
                        <Route path="/rooms/:roomId" exact component={RoomComponent} />
                        <Route path="/rooms/:roomId/unavailable" component={RoomUnavailableComponent} />
                        <Route path="/login" component={LoginComponent} />
                        <Route path="/" exact component={LandingComponent} />
                    </div>
                </main>
            </div>
        );
    }

    private handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    private handleDrawerClose = () => {
        this.setState({ open: false });
    };

    private handleNavigate = (to: string) => {
        this.props.history.push(to);
    }
}

const appWithRouter = withRouter(App);
export default withStyles(styles, { withTheme: true })(appWithRouter);
