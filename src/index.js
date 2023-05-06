import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { firebase } from "./providers/FirebaseProvider";
import { mobileNotificationsFirebase } from "./providers/MobileNotificationsProvider";
import UserProvider from "./providers/UserProvider";

export const FirebaseContext = React.createContext({});
export const MobileNotificationsContext = React.createContext({});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={firebase}>
        <MobileNotificationsContext.Provider value={mobileNotificationsFirebase}>
          <UserProvider>
            <App />
          </UserProvider>
        </MobileNotificationsContext.Provider>
    </FirebaseContext.Provider>
  </React.StrictMode>
);
