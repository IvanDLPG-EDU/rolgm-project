import { useState, useEffect } from "react";
import { RoomContext } from "./allContext";

export const RoomProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("chat-tab");
  const [activeRoom, setActiveRoom] = useState(null);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const [selectedName, setSelectedName] = useState(null);
  const [characterList, setCharacterList] = useState([]);

  useEffect(() => {
    if (characterList.length > 0 && !selectedName) {
      setSelectedName(characterList[0].name);
    }
  }, [characterList]);

  return (
    <RoomContext.Provider
      value={{
        activeTab,
        handleTabClick,
        setActiveRoom,
        activeRoom,
        setSelectedName,
        selectedName,
        setCharacterList,
        characterList,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
