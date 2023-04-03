import React, { useState } from 'react';
import { Canvas } from './Canvas';
import { RoomProvider } from './context/RoomProvider';
import { SideRoomMenu } from './SideRoomMenu';
import './styles/rooms.css'

export const Room = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const handleMenuButtonClick = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <RoomProvider> 
      <div className={`room-wrapper ${isSideMenuOpen ? 'room-menu-open' : ''}`}>
        <div className="room-canvas">
          <button className="room-menu-btn" onClick={handleMenuButtonClick}>
            {isSideMenuOpen ? '>' : '<'}
          </button>
          <Canvas />
          <div className="room-menu">
            <SideRoomMenu />
          </div>
        </div>
      </div>
    </RoomProvider> 
  );
};