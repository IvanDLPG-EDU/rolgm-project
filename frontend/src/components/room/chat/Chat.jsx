import React, { useState, useEffect, useContext, useRef } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import { RoomContext } from '../../../contexts';

const Chat = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const {activeRoom, selectedName, setSelectedName, characterList} = useContext(RoomContext)
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messages]);


  useEffect(() => {
    if (activeRoom){
      const newClient = new WebSocket(`ws://172.18.0.2:8000/ws/room/${activeRoom.name.replace(' ', '_')}/${activeRoom.room_id}/`);
      
      if (messages.length === 0) {
        setMessages(activeRoom.messages)
      }

      newClient.onmessage = (message) => {
        const messageData = JSON.parse(message.data);
        setMessages(messages => [...messages, messageData]);
      };

      setClient(newClient);

      return () => {
        newClient.close();
      };
    }

  }, [activeRoom]);

  const sendMessage = () => {
    if (!message || /^\s*$/.test(message)) {
      return;
    }
  
    const data = {
      message: message.trim(),
      written_as: selectedName
    };
    client.send(JSON.stringify({ data }));
    setMessage('');
  };

  
  return (
    <div className="container">
      {/* Mensajes */}
      <div className="row bg-light" style={{ height: "50vh", overflowY: "auto", wordBreak: "break-word", paddingTop: "8px", paddingBottom: "1px", marginTop: "8px"}} ref={messagesEndRef}>
        {messages.map((message, index) => (
          <p key={index}>
            {message.written_as}: {message.message}
          </p>
        ))}
        
      </div>
  
      {/* Envío y botones */}
      <div className="row">
        <div className="col" style={{ backgroundColor: "#444444", paddingTop: "10px", position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <div className="row">
            <div className="w-100">
              <input
                className="form-control mb-3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <select
                className="form-select mb-3"
                onChange={(e) => setSelectedName(e.target.value)}
              >
                {characterList.map((character) => (
                  <option key={character.id} value={character.name}>
                    {character.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <button className="btn btn-primary w-100" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
 
};

export default Chat;

