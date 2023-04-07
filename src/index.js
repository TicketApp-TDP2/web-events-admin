import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { firebase } from './providers/FirebaseProvider';
import UserProvider from './providers/UserProvider';

export const FirebaseContext = React.createContext({});

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const FirebaseContext = React.createContext({});

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: "ticketapp-public.firebaseapp.com",
    projectId: "ticketapp-public",
    storageBucket: "ticketapp-public.appspot.com",
    messagingSenderId: "281878738338",
    appId: process.env.FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firebase = {storage}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <FirebaseContext.Provider value={firebase}>
            <UserProvider>
                <App />
            </UserProvider>
            <App />
        </FirebaseContext.Provider>
    </React.StrictMode>
);
