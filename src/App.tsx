import * as React from 'react';
import './App.css';
import { LocalVideoComponent } from './components/component-local-video';
import logo from './logo.svg';

class App extends React.Component {
    public render() {
        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h1 className="app-title">Strength in Numbers</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>

                <LocalVideoComponent />
            </div>
        );
    }
}

export default App;
