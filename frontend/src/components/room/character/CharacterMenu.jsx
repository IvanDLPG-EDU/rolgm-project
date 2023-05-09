import React, { useMemo } from "react";
import { Template } from "./Template";
import { SideRoomMenu } from "../sidemenu";
import Character from "./Character";

const CharacterMenu = () => {
  
  const tabs = [
    { name: "CharacterList", icon: "/media/character-icon.png", content: <Character /> },
    { name: "TemplateList", icon: "/media/settings.svg", content: <Template /> },
  ];

  const memoizedSideMenu = useMemo(() => <SideRoomMenu tabs={tabs} />, []); 

  return (
    <>
        <div className="character-menu">{memoizedSideMenu}</div>
    </>
  );
};

export default CharacterMenu;
