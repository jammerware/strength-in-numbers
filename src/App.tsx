import * as React from 'react';
import { Route, Link } from 'react-router-dom';
import { LandingComponent } from './components/landing/component-landing';
import { RoomComponent } from './components/room/component-room';
import { RoomsComponent } from './components/rooms/component-rooms';
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
                </nav>
                <div className="content-container">
                    <Route path="/rooms" exact component={RoomsComponent} />
                    <Route path="/rooms/:roomId" component={RoomComponent} />
                    <Route path="/" exact component={LandingComponent} />
                </div>
            </div>
        );
    }
}

export default App;
