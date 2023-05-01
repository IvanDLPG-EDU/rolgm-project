import { useState } from "react";
import { RoomContext } from "./allContext";

export const RoomProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("chat-tab");
  const [activeRoom, setActiveRoom] = useState(null);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const [characterList, setCharacterList] = useState([]);

  return (
    <RoomContext.Provider
      value={{
        activeTab,
        handleTabClick,
        setActiveRoom,
        activeRoom,
        setCharacterList,
        characterList,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
