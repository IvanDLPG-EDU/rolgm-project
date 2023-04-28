import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Canvas } from "./canvas";
import { SideRoomMenu } from "./sidemenu";
import { RoomContext, UserContext } from "../../contexts";

export const Room = () => {
  const { setActiveRoom, setCharacterList } = useContext(RoomContext);
  const { token } = useContext(UserContext);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { roomName, roomId } = useParams();

  const handleMenuButtonClick = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      const response = await fetch(
        `http://172.18.0.2:8000/api/room/${roomName}/${roomId}`
      );
      const data = await response.json();
      setActiveRoom(data);
    };

    fetchRoomData();
  }, [roomName]);

  useEffect(() => {
    fetch(
      `http://172.18.0.2:8000/api/room/${roomName}/${roomId}/my-characters/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) =>
        setCharacterList(
          data[0].characters.filter((character) => character.name.trim() !== "")
        )
      )
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className={`room-wrapper ${isSideMenuOpen ? "room-menu-open" : ""}`}>
      <div className="room-canvas">
        <button className="room-menu-btn" onClick={handleMenuButtonClick}>
          {isSideMenuOpen ? ">" : "<"}
        </button>
        <Canvas />
        <div className="room-menu">
          <SideRoomMenu />
        </div>
      </div>
    </div>
  );
};

export default Room;
