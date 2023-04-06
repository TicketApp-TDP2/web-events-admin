import React, { useCallback, useEffect, useState } from "react";
import { getUser } from "../services/userService";

export const UserContext = React.createContext({});

function UserProvider({ children }) {
  const [user, setUser] = useState({});

  const fetchUser = useCallback(async (id) => {
    const response = await getUser(id);
    localStorage.setItem("user", JSON.stringify(response));
    setUser(response);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser({});
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