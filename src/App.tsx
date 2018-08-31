import * as React from 'react';
import './App.css';
import { LocalVideoComponent } from './components/local-video/component-local-video';
import logo from './logo.svg';

class App extends React.Component {
    public render() {
        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h1 className="app-title">Strength in Numbers</h1>
                </header>

                <LocalVideoComponent />
            </div>
        );
    }
}

export default App;
