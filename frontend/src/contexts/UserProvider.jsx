import { useState, useEffect } from "react";
import { UserContext } from "./allContext";
import { toast } from 'react-toastify';

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);


  const handleLogout = () => {
    setUser(null)
    setToken(null)
  }

  const handleLogin = (data) => {

    setUser(data);
    setToken(data.token)
    window.location.reload()

  }

  const handleRegister = (data) => {

    toast.success("Se ha registrado correctamente, revise su email para verificar su cuenta");

  }

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  
  }, [darkMode])
  

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }, [token]);

  return (
    <UserContext.Provider value={{ 
      token, setToken, 
      user, setUser, 
      darkMode, setDarkMode,
      handleLogout, 
      handleLogin,
      handleRegister,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
