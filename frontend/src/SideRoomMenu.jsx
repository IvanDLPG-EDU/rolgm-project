import React, { useContext, useState } from 'react'
import { RoomContext } from './context/allContext';
import { MenuTab } from './MenuTab';

export const SideRoomMenu = () => {

  const {activeTab} = useContext(RoomContext)

  return (
    <>
      <ul className="nav nav-tabs">
        <MenuTab tabName={"chat-tab"} icon={"/media/chat-icon.svg"} />
        <MenuTab tabName={"settings-tab"} icon={"/media/settings.svg"} />
      </ul>

      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'chat-tab' ? 'active' : ''}`} id="chat-tab">
          {/* Contenido de la pestaña de chat */}
          <p>Pestaña de Chat</p>
          {/* <Chat /> */}
        </div>
        <div className={`tab-pane ${activeTab === 'settings-tab' ? 'active' : ''}`} id="settings-tab">
          {/* Contenido de la pestaña de opciones */}
          <p>Pestaña de Opciones</p>
        </div>
      </div>
    </>
  );
}