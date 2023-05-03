import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const [scrollBottom, setScrollBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    setScrollBottom(true);
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", scrollToBottom);
    return () => window.removeEventListener("resize", scrollToBottom);
  }, []);

  useEffect(() => {
    if (scrollBottom) {
      scrollToBottom();
    }
  }, [messages, scrollBottom]);

  return (
    <div
      ref={messagesEndRef}
      className="flex-grow-1 p-3"
      style={{
        backgroundColor: "#f9f9f9",
        height: "calc(100vh - 108px - 60px)",
        overflow: "auto",
      }}
    >
      {messages.map(({ message, written_as }, index) => (
        <p key={index} className="mb-1 text-break">
          <strong>{written_as}:</strong> {message}
        </p>
      ))}
    </div>
  );
};

export default MessageList;
