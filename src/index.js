import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { firebase } from './providers/FirebaseProvider';

export const FirebaseContext = React.createContext({});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <FirebaseContext.Provider value={firebase}>
            <App />
        </FirebaseContext.Provider>
    </React.StrictMode>
);
