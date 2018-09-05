import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './components/app/App';
import './index.css';
import { AuthProvider } from './providers/provider-auth';
import registerServiceWorker from './registerServiceWorker';

// initialize firebase
new AuthProvider().initFirebaseApp();

// create MUI theme so it's available in child components
const theme = createMuiTheme();

// render the app
ReactDOM.render(
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </BrowserRouter>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
