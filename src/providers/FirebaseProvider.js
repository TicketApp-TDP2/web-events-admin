import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: "ticketapp-organizer.firebaseapp.com",
    projectId: "ticketapp-organizer",
    storageBucket: "ticketapp-organizer.appspot.com",
    messagingSenderId: "565725159820",
    appId: process.env.REACT_APP_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
export const firebase = {storage, auth, provider}