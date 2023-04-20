import React from 'react'
import { Navigate, Route, Routes, useLocation  } from 'react-router-dom'
import { RoomProvider } from './context/RoomProvider';
import { HomePage } from './HomePage'
import { RoomList } from './Rooms/RoomList'
import { MainNavbar } from './Rooms/Navbar'
import { Room } from './Rooms/Room'

export const App = () => {
    const location = useLocation();
    const shouldRenderNavbar = !location.pathname.includes('/sala/');
    
    return (
      <>
        <RoomProvider>
          {shouldRenderNavbar && <MainNavbar />}
          <Routes>  
            <Route path="/" element={<HomePage />} />
            <Route path="/salas" element={<RoomList />} />
            <Route path="/sala-debug" element={<Room />} /> 
            <Route path="/sala/:roomName/:roomId" element={<Room />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>  
        </RoomProvider>
      </>
    )
}
