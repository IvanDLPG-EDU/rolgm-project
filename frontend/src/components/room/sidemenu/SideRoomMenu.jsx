import React, { useState, useMemo, useCallback } from "react";
import MenuTab from "./MenuTab";
import MenuContent from "./MenuContent";

const SideRoomMenu = ({ tabs }) => {

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const handleTabClick = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  const renderTabs = useMemo(
    () =>
      tabs.map(({ name, icon }) => (
        <MenuTab
          key={name}
          tabName={name}
          icon={icon}
          active={activeTab === name}
          onClick={handleTabClick}
        />
      )),
    [tabs, activeTab, handleTabClick]
  );
  
  const renderContents = useMemo(
    () =>
      tabs.map(({ name, content }) => (
        <MenuContent key={name} active={activeTab === name}>
          {content}
        </MenuContent>
      )),
    [tabs, activeTab]
  );

  return (
    <div>
      <ul className="nav nav-tabs">{renderTabs}</ul>
      <div className="tab-content">{renderContents}</div>
    </div>
  );
};

export default SideRoomMenu;
