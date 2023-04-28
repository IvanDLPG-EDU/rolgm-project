import React, { useContext } from "react";
import { RoomContext } from "../../../contexts";

export const MenuTab = ({ tabName, icon, tabWidth = 24, tabHeight = 24 }) => {
  const { activeTab, handleTabClick } = useContext(RoomContext);
  return (
    <li className="nav-item">
      <button
        className={`nav-link ${activeTab === tabName ? "active" : ""}`}
        onClick={() => handleTabClick(tabName)}
      >
        <img src={icon} alt={tabName} width={tabWidth} height={tabHeight} />
      </button>
    </li>
  );
};

export default MenuTab;
