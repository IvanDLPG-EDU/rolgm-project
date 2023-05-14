import React, { useEffect, useLayoutEffect, useRef, useState, useContext } from "react";
import Message from "./Message";
import { RoomContext } from "../../../contexts";

const MessageList = () => {
  const { roomData } = useContext(RoomContext)
  const { messages, ownPlayer, loadingOwnPlayer } = roomData
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
      className="flex-grow-1 p-3 custom-scrollbar"
      style={{
        height: "calc(100vh - 108px - 60px)",
        overflow: "auto",
      }}
    >
      { !loadingOwnPlayer && messages.map(({ message, written_as, user, id }) => {

        let is_own = ownPlayer.user === user;

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
