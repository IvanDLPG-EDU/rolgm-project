import { useState, useEffect } from "react";
import { UserContext } from "./allContext";

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const handleLogout = () => {
    setUser(null)
    setToken(null)
  }

  const handleLogin = (data) => {

    setUser(data);
    setToken(data.token)

  }

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }, [token]);

  return (
    <UserContext.Provider value={{ token, setToken, user, setUser, handleLogout, handleLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
