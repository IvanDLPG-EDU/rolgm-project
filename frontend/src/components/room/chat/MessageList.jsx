import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Message from "./Message";

const MessageList = ({ messages, UserID }) => {
  const messagesEndRef = useRef(null);
  const [scrollBottom, setScrollBottom] = useState(true);

  let lastWrittenAs = null

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
      {messages.map(({ message, written_as, user, id }) => {
        let is_own = UserID === user;

        // Mostrar el nombre solo si el mensaje anterior no fue del mismo personaje
        let showName = lastWrittenAs !== written_as;
        lastWrittenAs = written_as;

        return (
          <Message
            key={id}
            message={message}
            written_as={showName ? written_as : null}
            is_own={is_own}
          />
        );
      })}

    </div>
  );
};

export default MessageList;
