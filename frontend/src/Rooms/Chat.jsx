import React, { useState, useEffect } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';

const Chat = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newClient = new WebSocket('ws://172.18.0.2:8000/ws/room/1/');

    newClient.onmessage = (message) => {
      const messageData = JSON.parse(message.data);
      setMessages(messages => [...messages, messageData]);
    };

    setClient(newClient);

    return () => {
      newClient.close();
    };
  }, []);

  const sendMessage = () => {
    client.send(JSON.stringify({ message }));
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message.message}</p>
        ))}
      </div>
      <div>
        <input value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
