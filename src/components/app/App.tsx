import * as React from 'react';
import { Route, Link } from 'react-router-dom';

import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { LandingComponent } from '../landing/component-landing';
import { RoomComponent } from '../room/component-room';
import { RoomsComponent } from '../rooms/component-rooms';
import { LoginComponent } from '../login/component-login';
import './App.css';

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        height: 440,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
        position: 'relative',
        width: 240,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
});

class App extends React.Component<{ classes: any }, {}> {
    public render() {
        return (
            <div className="app">
                <AppBar position="static" className={this.props.classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" noWrap>
                            Strength in Numbers
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer variant="permanent">
                    <Divider />
                    <List component="nav">
                        <ListItem button>
                            <ListItemText primary="Trash" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Things" />
                        </ListItem>
                    </List>
                </Drawer>

                <Link to="/">Home</Link>
                <Link to="/rooms">Rooms</Link>
                <Link to="/rooms/1234">Video tech demo</Link>
                <Link to="/login">Log in</Link>
                <div className="content-container">
                    <Route path="/rooms" exact component={RoomsComponent} />
                    <Route path="/rooms/:roomId" component={RoomComponent} />
                    <Route path="/login" component={LoginComponent} />
                    <Route path="/" exact component={LandingComponent} />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(App);
