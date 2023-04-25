import React, { useState, useEffect, useContext, useRef } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import { RoomContext } from '../../../contexts';

const Chat = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const {activeRoom} = useContext(RoomContext)
  
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
    const data = {
      message: message,
      written_as: selectedName
    };
    client.send(JSON.stringify({ data }));
    setMessage('');
  };

  const names = ["John", "Alice", "Bob", "Emily", "David"];

  const [selectedName, setSelectedName] = useState(names[0]);

  return (
    <div className="container">
      <div className="row">
        <div className="col" style={{ maxHeight: "70vh", overflowY: "scroll", wordBreak: "break-word", marginBottom:"20px" }} ref={messagesEndRef}>
        {messages.map((message, index) => (
          <p key={index}>
            {message.written_as}: {message.message}
          </p>
        ))}
        </div>
      </div>
      <div className="row p-3" style={{ height: "30vh", paddingTop: "20px" }}>
        <div className="col" style={{ backgroundColor: "#444444", position: "absolute", bottom: 0, left: 0, right: 0, paddingTop: "10px" }}>
          <input
            className="form-control mb-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="row">
            <div className="col-auto">
              <select
                className="form-select mb-3"
                onChange={(e) => setSelectedName(e.target.value)}
              >
                {names.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-auto text-end">
              <button className="btn btn-primary" onClick={sendMessage}>
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

