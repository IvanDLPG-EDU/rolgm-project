import React, { useState } from 'react'

export const SideRoomMenu = () => {
  const [activeTab, setActiveTab] = useState('chat-tab')

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
  }

  return (
    <>
      <ul className="nav nav-tabs">
        <li className="nav-item">
        <button className={`nav-link ${activeTab === 'chat-tab' ? 'active' : ''}`} onClick={() => handleTabClick('chat-tab')}>
          <img src="/media/chat-icon.svg" alt="Chat Icon" width="24" height="24" />
        </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'options-tab' ? 'active' : ''}`} onClick={() => handleTabClick('options-tab')}>
          <img src="/media/settings.svg" alt="Settings Icon" width="24" height="24" />
          </button>
        </li>
      </ul>

      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'chat-tab' ? 'active' : ''}`} id="chat-tab">
          {/* Contenido de la pestaña de chat */}
          <p>Pestaña de Chat</p>
          {/* <Chat /> */}
        </div>
        <div className={`tab-pane ${activeTab === 'options-tab' ? 'active' : ''}`} id="options-tab">
          {/* Contenido de la pestaña de opciones */}
          <p>Pestaña de Opciones</p>
        </div>
      </div>
    </>
  );
}