import React, { useState, useContext, useEffect } from "react";
import { RoomContext, UserContext } from "../../../contexts";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";


const Chat = () => {

  const { roomData } = useContext(RoomContext);
  const { ownPlayer, user } = roomData
  const [nameList, setNameList] = useState([]);

  useEffect(() => {
    if (ownPlayer) {
      setNameList([user.public_name, ...ownPlayer.characters.map(character => character.name)])
    }
  }, [roomData.ownPlayer])

  return (
    <div>
      <MessageList />
      <MessageForm
        nameList={nameList}
      />
    </div>
  );
};

export default Chat;
