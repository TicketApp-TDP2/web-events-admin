import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

export const FirebaseContext = React.createContext({});

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: "ticketapp-public.firebaseapp.com",
    projectId: "ticketapp-public",
    storageBucket: "ticketapp-public.appspot.com",
    messagingSenderId: "281878738338",
    appId: process.env.REACT_APP_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const firebase = {storage, auth, provider}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <FirebaseContext.Provider value={firebase}>
            <App />
        </FirebaseContext.Provider>
    </React.StrictMode>
);
