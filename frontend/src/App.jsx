import React, { useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HomePage, RoomListPage, MyProfile } from "./pages";
import { ConfirmEmail, MainNavbar, Room } from "./components";
import { UserContext } from "./contexts";
import "./styles/rooms.css";
import "./styles/home.css";
import "./styles/nav.css";
import { DetailedRoomPage } from "./pages/DetailedRoomPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const location = useLocation();
  const shouldRenderNavbar = !location.pathname.includes("/sala/") || location.pathname.includes("/detail");
  const shouldRenderToast = !location.pathname.includes("/email-verify/");
  const { user } = useContext(UserContext);
  return (
    <>
      {shouldRenderNavbar && <MainNavbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/email-verify/:token/" element={<ConfirmEmail />} />
        {user ? (
          <>
            <Route path="/salas" element={<RoomListPage />} />
            <Route path="/mis-partidas" element={<RoomListPage />} />
            <Route path="/sala/:roomId" element={<Room />} />
            <Route path="/mi-perfil" element={<MyProfile />} />
            <Route path="/sala/:roomId/detail" element={<DetailedRoomPage />} />
          </>
        ) : (
          ""
        )}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
      { shouldRenderToast ? <ToastContainer /> : '' }
    
    </>
  );
};

