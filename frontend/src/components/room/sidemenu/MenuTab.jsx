import React from "react";

const MenuTab = ({ tabName, icon, active = false, tabWidth = 24, tabHeight = 24, onClick }) => {
  return (
    <li className="nav-item">
      <button
        className={`nav-link ${active ? "active" : ""}`}
        onClick={() => onClick(tabName)}
      >
        <img src={icon} alt={tabName} width={tabWidth} height={tabHeight} />
      </button>
    </li>
  );
};

export default MenuTab;
