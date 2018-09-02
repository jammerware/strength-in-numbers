import * as React from 'react';
import { Route, Link } from 'react-router-dom';
import { LandingComponent } from '../landing/component-landing';
import { RoomComponent } from '../room/component-room';
import { RoomsComponent } from '../rooms/component-rooms';
import { LoginComponent } from '../login/component-login';
import './App.css';
import logo from './logo.svg';

class App extends React.Component {
    public render() {
        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h1 className="app-title">Strength in Numbers</h1>
                </header>

                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/rooms">Rooms</Link>
                    <Link to="/rooms/1234">Video tech demo</Link>
                    <Link to="/login">Log in</Link>
                </nav>
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

export default App;
