import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { firebase } from "./providers/FirebaseProvider";
import UserProvider from "./providers/UserProvider";

export const FirebaseContext = React.createContext({});

const root = ReactDOM.createRoot(document.getElementById("root"));
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
