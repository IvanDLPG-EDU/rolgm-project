import React from 'react'
import { Navigate, Route, Routes, useLocation  } from 'react-router-dom'
import { HomePage } from './HomePage'
import { Room } from './Room'
import { RoomList } from './RoomList'
import { MainNavbar } from './Navbar'

export const App = () => {
    const location = useLocation();
    const shouldRenderNavbar = !location.pathname.includes('/sala-debug');
    
    return (
      <>
        {shouldRenderNavbar && <MainNavbar />}
        <Routes>  
          <Route path="/" element={<HomePage />} />
          <Route path="/salas" element={<RoomList />} />
          <Route path="/sala-debug" element={<Room />} /> 
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>  
      </>
    )
}
