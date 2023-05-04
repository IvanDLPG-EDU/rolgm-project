import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../contexts";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";


const Chat = ({ client, messages, characterList }) => {

  const { user } = useContext(UserContext);
  const [ nameList, setNameList ] = useState([]);

  useEffect(() => {
    setNameList([user.public_name, ...characterList.map(character => character.name)])
  }, [characterList])
  
  return (
    <div>
      <MessageList messages={messages} UserID={user.id}/>
      <MessageForm
        nameList={nameList}
        client={client}
        UserID={user.id}
      />
    </div>
  );  
};

export default Chat;
