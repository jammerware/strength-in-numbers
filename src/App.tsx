import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import { TwilioApiProvider } from './providers/provider-twilio-api';

class App extends React.Component {
    private twilioApi = new TwilioApiProvider();

    constructor(props: any) {
        super(props);
    }

    public async componentDidMount() {
        await this.twilioApi.getToken("ben", "friends");
    }

    public render() {
        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h1 className="app-title">Strength in Numbers</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                    {this.twilioApi.getThing()}
                </p>
            </div>
        );
    }
}

export default App;
