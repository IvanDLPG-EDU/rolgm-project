// import React, { useState } from 'react';
// import { Canvas } from './Canvas';
// import { RoomProvider } from '../context/RoomProvider';
// import { SideRoomMenu } from './SideRoomMenu';
// import '../styles/rooms.css'

// export const Room = () => {
//   const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

//   const handleMenuButtonClick = () => {
//     setIsSideMenuOpen(!isSideMenuOpen);
//   };

//   return (
//     <RoomProvider> 
//       <div className={`room-wrapper ${isSideMenuOpen ? 'room-menu-open' : ''}`}>
//         <div className="room-canvas">
//           <button className="room-menu-btn" onClick={handleMenuButtonClick}>
//             {isSideMenuOpen ? '>' : '<'}
//           </button>
//           <Canvas />
//           <div className="room-menu">
//             <SideRoomMenu />
//           </div>
//         </div>
//       </div>
//     </RoomProvider> 
//   );
// };

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from './Canvas';
import { SideRoomMenu } from './SideRoomMenu';
import '../styles/rooms.css';
import { RoomContext } from '../context/allContext';

export const Room = () => {
  const {setActiveRoom} = useContext(RoomContext)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { roomName, roomId } = useParams();

  const handleMenuButtonClick = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      const response = await fetch(`http://172.18.0.2:8000/api/room/${roomName}/${roomId}`);
      const data = await response.json();
      setActiveRoom(data)
    };

    fetchRoomData();
  }, [roomName]);

  return ( 
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
  );
};