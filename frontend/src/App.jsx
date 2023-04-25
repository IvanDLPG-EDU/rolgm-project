import React from 'react'
import { Navigate, Route, Routes, useLocation  } from 'react-router-dom'
import { RoomProvider } from './contexts';
import { HomePage, RoomListPage } from "./pages";
import { MainNavbar, Room} from './components';
import "./styles/rooms.css"

export const App = () => {
    const location = useLocation();
    const shouldRenderNavbar = !location.pathname.includes('/sala/');
    
    return (
      <>
        <RoomProvider>
          {shouldRenderNavbar && <MainNavbar />}
          <Routes>  
            <Route path="/" element={<HomePage />} />
            <Route path="/salas" element={<RoomListPage />} />
            <Route path="/sala-debug" element={<Room />} /> 
            <Route path="/sala/:roomName/:roomId" element={<Room />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>  
        </RoomProvider>
      </>
    )
}
