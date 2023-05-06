import { useState, useEffect } from "react";
import { RoomContext } from "./allContext";

export const RoomProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("chat-tab");
  const [activeRoom, setActiveRoom] = useState(null);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  
  const [ownPlayer, setOwnPlayer] = useState([]);
  const [characterList, setCharacterList] = useState([]);
  const [templateList, setTemplateList] = useState([]);


  useEffect(() => {
    setCharacterList(ownPlayer?.characters || []);
  }, [ownPlayer]);

  return (
    <RoomContext.Provider
      value={{
        activeTab,
        handleTabClick,
        setActiveRoom,
        activeRoom,
        setCharacterList,
        characterList,
        templateList,
        setTemplateList,
        setOwnPlayer,
        ownPlayer,

      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
