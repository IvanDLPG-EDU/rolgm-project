import React, { useState, useContext, useEffect } from "react";
import { RoomContext, UserContext } from "../../../contexts";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import useWebSocket from "./useWebSocket";

const Chat = () => {
  const { activeRoom, characterList } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  const [ nameList, setNameList ] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const { client, messages } = useWebSocket(activeRoom);

  useEffect(() => {
    setNameList([user.public_name, ...characterList.map(character => character.name)])
    setSelectedName(nameList[0])
  }, [characterList])
  
  return (
    <div>
      <MessageList messages={messages} />
      <MessageForm
        selectedName={selectedName}
        setSelectedName={setSelectedName}
        nameList={nameList}
        client={client}
      />
    </div>
  );  
};

export default Chat;
