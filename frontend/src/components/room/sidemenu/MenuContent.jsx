import React from "react";

const MenuContent = ({ active, children }) => {
  if (!active) return null;
  return <div className="tab-pane active">{children}</div>;
};

export default MenuContent;
