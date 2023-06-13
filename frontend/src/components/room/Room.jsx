import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "./canvas";
import { DirectoryTab, Settings, SideRoomMenu } from "./sidemenu";
import { RoomContext, UserContext } from "../../contexts";
import { Chat } from "./chat";
import { CharacterMenu } from "./character";
import Character from "./character/Character";

const backend_url = import.meta.env.VITE_API_URL;

const Room = () => {
  const navigate = useNavigate();
  const { setActiveRoom } = useContext(RoomContext);
  const { darkMode } = useContext(UserContext);
  const { roomId } = useParams();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);


  const fetchRoomData = async (roomId, setActiveRoom) => {
    const response = await fetch(`${backend_url}/api/room/${roomId}`,
      { headers: { Authorization: `Token ${localStorage.getItem('token')}` } });
    const data = await response.json();
  
    if (data.detail) {
      navigate('/');
      return;
    }
  
    setActiveRoom(data);
  };


  const handleMenuButtonClick = () => setIsSideMenuOpen(!isSideMenuOpen);

  const tabs = [
    { name: "Chat", icon: "/media/chat-icon.svg", content: <Chat /> },
    // { name: "Character", icon: "/media/character-icon.png", content: <CharacterMenu /> },
    { name: "Character", icon: "/media/character-icon.png", content: <Character /> },
    // { name: "Directory", icon: "/media/diary.svg", content: <DirectoryTab /> },
    // { name: "Music", icon: "/media/music.svg", content: <Chat /> },
    { name: "Setting", icon: "/media/settings.svg", content: <Settings /> },
  ];

  useEffect(() => {
    fetchRoomData(roomId, setActiveRoom);
  }, []);

  const memoizedSideMenu = useMemo(() => <SideRoomMenu tabs={tabs} />, []);

  return (
    <div className={`room-wrapper ${isSideMenuOpen ? "room-menu-open" : ""}`}>
      <div className="room-canvas">
      <button
        className="room-menu-btn"
        style={{
          width: '35px',
          height: '35px',
          // borderRadius: '50%',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'black',
          border: "2px solid black",
          
        }}
        onClick={handleMenuButtonClick}
      >
        <span
          style={{
            fontSize: '35px',
            position: 'relative',
            top: '-13px',
            left: '-8px',
            
          }}
        >
          {isSideMenuOpen ? '►' : '◄'}
        </span>
      </button>
        <Canvas />
        <div className={`room-menu 
           ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}
            `}
            style={{
              border: '1px solid black',
              borderLeft: 'none',
              boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
            }}
            >{memoizedSideMenu}</div>
      </div>
    </div>
  );
};

export default Room;