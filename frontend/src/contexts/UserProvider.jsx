import { useState, useEffect } from 'react';
import { UserContext } from './allContext'

export const UserProvider = ({children}) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider;