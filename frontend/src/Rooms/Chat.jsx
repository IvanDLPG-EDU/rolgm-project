import React, { useState, useEffect } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const ws = new WebSocket('ws://172.18.0.2:8000/ws/chat/1/');

  useEffect(() => {
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    ws.send(JSON.stringify({ message: inputValue }));
    setInputValue('');
  };

  return (
    <>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default Chat;
