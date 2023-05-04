import React, {useCallback, useContext, useEffect, useState} from "react";
import { getOrganizer } from "../services/organizerService";
import {FirebaseContext} from "../index";

export const UserContext = React.createContext({});

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const firebaseContext = useContext(FirebaseContext);

  const fetchUser = useCallback(async (id) => {
    const response = await getOrganizer(id);
    localStorage.setItem("user", JSON.stringify(response));
    console.log("response: " + JSON.stringify(response));
    setUser(response);
    return response;
  }, []);

  const logout = () => {
    firebaseContext.auth.signOut().then((out) => {
      console.log("user signed out");
      localStorage.removeItem("user");
      setUser(null);
    })
  }

  useEffect(() => {
    function fetchUserFromStorage() {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      if (userInfo) setUser(userInfo);
    }
    fetchUserFromStorage();
  }, [])

  return (
    <UserContext.Provider value={{ user, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;