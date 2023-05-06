import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Canvas } from "./canvas";
import { SideRoomMenu } from "./sidemenu";
import { RoomContext, UserContext } from "../../contexts";
import { Chat } from "./chat";
import { CharacterMenu } from "./character";
import useWebSocket from "./hooks/useWebSocket";

const fetchRoomData = async (roomId, setActiveRoom) => {
  const response = await fetch(`http://172.18.0.2:8000/api/room/${roomId}`);
  const data = await response.json();
  setActiveRoom(data);
};

const fetchOwnPlayer = async (roomId, token, setOwnPlayer) => {
  try {
    const response = await fetch(
      `http://172.18.0.2:8000/api/room/${roomId}/my-player/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    const data = await response.json();
    setOwnPlayer(data[0] || null);
  } catch (error) {
    console.error(error);
  }
};

const fetchMessages = async (roomId, token, setMessages) => {
  try {
    const response = await fetch(
      `http://172.18.0.2:8000/api/room/${roomId}/chat/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    const data = await response.json();
    setMessages(data?.messages || []);
  } catch (error) {
    console.error(error);
  }
};

const Room = () => {
  const { setActiveRoom, setOwnPlayer, activeRoom, characterList } = useContext(RoomContext);
  const { token, user } = useContext(UserContext);
  const { roomId } = useParams();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const { client } = useWebSocket(activeRoom, setMessages);

  const handleMenuButtonClick = () => setIsSideMenuOpen(!isSideMenuOpen);

  const tabs = [
    { name: "Chat", icon: "/media/chat-icon.svg", content: <Chat client={client} messages={messages} characterList={characterList} /> },
    { name: "Character", icon: "/media/character-icon.png", content: <CharacterMenu /> },
    { name: "Diary", icon: "/media/diary.svg", content: <Chat /> },
    { name: "Music", icon: "/media/music.svg", content: <Chat /> },
    { name: "Setting", icon: "/media/settings.svg", content: <Chat /> },
  ];

  useEffect(() => {
    fetchRoomData(roomId, setActiveRoom);
  }, []);

  useEffect(() => {
    fetchOwnPlayer(roomId, token, setOwnPlayer);
    fetchMessages(roomId, token, setMessages)
  }, [token, activeRoom]);

  const memoizedSideMenu = useMemo(() => <SideRoomMenu tabs={tabs} />, [client, messages, characterList]);

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
