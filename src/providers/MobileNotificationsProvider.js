import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getDatabase } from "firebase/database";

const firebaseConfigMobile = {
    apiKey: process.env.REACT_APP_MOBILE_APIKEY,
    authDomain: process.env.REACT_APP_MOBILE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_MOBILE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_MOBILE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MOBILE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_MOBILE_APP_ID,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
};

const mobileApp = initializeApp(firebaseConfigMobile, 'mobile');
const messaging = getMessaging(mobileApp);
const db = getDatabase(mobileApp);

export const mobileNotificationsFirebase = {messaging, db}
