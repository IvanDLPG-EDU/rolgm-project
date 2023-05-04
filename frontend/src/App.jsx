import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { RoomProvider, UserProvider } from "./contexts";
import { HomePage, LoginPage, RegistrationPage, RoomCreationPage, RoomListPage } from "./pages";
import { MainNavbar, Room } from "./components";
import "./styles/rooms.css";
import "./styles/home.css";

export const App = () => {
  const location = useLocation();
  const shouldRenderNavbar = !location.pathname.includes("/sala/");
  return (
    <>
      <UserProvider>
        <RoomProvider>
          {shouldRenderNavbar && <MainNavbar />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/salas" element={<RoomListPage />} />
            <Route path="/salas/crear" element={<RoomCreationPage />} />
            <Route path="/sala/sala-debug" element={<Room />} />
            <Route path="/sala/:roomId" element={<Room />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </RoomProvider>
      </UserProvider>
    </>
  );
};
