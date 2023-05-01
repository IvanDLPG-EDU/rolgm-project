import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Canvas } from "./canvas";
import { SideRoomMenu } from "./sidemenu";
import { RoomContext, UserContext } from "../../contexts";
import { Chat } from "./chat";
import { Character } from "./character";

const fetchRoomData = async (roomName, roomId, setActiveRoom) => {
  const response = await fetch(`http://172.18.0.2:8000/api/room/${roomName}/${roomId}`);
  const data = await response.json();
  setActiveRoom(data);
};

const fetchCharacterList = async (roomName, roomId, token, setCharacterList) => {
  try {
    const response = await fetch(
      `http://172.18.0.2:8000/api/room/${roomName}/${roomId}/my-characters/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    const data = await response.json();
    setCharacterList(data[0]?.characters || []);
  } catch (error) {
    console.error(error);
  }
};

const tabs = [
  { name: "Chat", icon: "/media/chat-icon.svg", content: <Chat /> },
  { name: "Character", icon: "/media/character-icon.png", content: <Character /> },
  { name: "Diary", icon: "/media/diary.svg", content: <Chat /> },
  { name: "Music", icon: "/media/music.svg", content: <Chat /> },
  { name: "Setting", icon: "/media/settings.svg", content: <Chat /> },
];

const Room = () => {
  const { setActiveRoom, setCharacterList } = useContext(RoomContext);
  const { token } = useContext(UserContext);
  const { roomName, roomId } = useParams();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const handleMenuButtonClick = () => setIsSideMenuOpen(!isSideMenuOpen);

  useEffect(() => {
    fetchRoomData(roomName, roomId, setActiveRoom);
    fetchCharacterList(roomName, roomId, token, setCharacterList);
  }, [roomName, roomId, token, setActiveRoom, setCharacterList]);

  const memoizedSideMenu = useMemo(() => <SideRoomMenu tabs={tabs} />, []); 

  return (
    <div className={`room-wrapper ${isSideMenuOpen ? "room-menu-open" : ""}`}>
      <div className="room-canvas">
        <button className="room-menu-btn" onClick={handleMenuButtonClick}>
          {isSideMenuOpen ? ">" : "<"}
        </button>
        <Canvas />
        <div className="room-menu">{memoizedSideMenu}</div>
      </div>
    </div>
  );
};

export default Room;
