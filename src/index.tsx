import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/App';
import './index.css';
import { AuthProvider } from './providers/provider-auth';
import registerServiceWorker from './registerServiceWorker';

// initialize firebase
new AuthProvider().initFirebaseApp();

// render the app
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
