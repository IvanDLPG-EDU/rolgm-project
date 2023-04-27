import React, { useContext, useState } from 'react'
import { Chat } from '../chat';
import { MenuTab } from './MenuTab';
import { RoomContext } from '../../../contexts'
export const SideRoomMenu = () => {

  const {activeTab} = useContext(RoomContext)

  return (
    <>
      <div style={{ height: "100vh", backgroundColor: "lightblue" }}>
        <ul className="nav nav-tabs">
          <MenuTab tabName={"chat-tab"} icon={"/media/chat-icon.svg"} />
          <MenuTab tabName={"gallery-tab"} icon={"/media/gallery.svg"} />
          <MenuTab tabName={"diary-tab"} icon={"/media/diary.svg"} />
          <MenuTab tabName={"music-tab"} icon={"/media/music.svg"} />
          <MenuTab tabName={"settings-tab"} icon={"/media/settings.svg"} />
        </ul>

        <div className="tab-content">
          <div className={`tab-pane ${activeTab === 'chat-tab' ? 'active' : ''}`} id="chat-tab">
            {/* Contenido de la pestaña de chat */}
            <Chat/>
            {/* <Chat /> */}
          </div>
          <div className={`tab-pane ${activeTab === 'gallery-tab' ? 'active' : ''}`} id="gallery-tab">
            {/* Contenido de la pestaña de imagenes */}
            <p>Pestaña de Imagenes</p>
            <p>¿Pestaña de Personajes?</p>
          </div>
          <div className={`tab-pane ${activeTab === 'diary-tab' ? 'active' : ''}`} id="diary-tab">
            {/* Contenido de la pestaña de diario */}
            <p>Pestaña de Diario</p>
            <p>¿Pestaña de Directorios?</p>
          </div>
          <div className={`tab-pane ${activeTab === 'music-tab' ? 'active' : ''}`} id="music-tab">
            {/* Contenido de la pestaña de musica */}
            <p>Pestaña de Musica</p>
            <p>¿Pestaña de Macros?</p>
          </div>
          <div className={`tab-pane ${activeTab === 'settings-tab' ? 'active' : ''}`} id="settings-tab">
            {/* Contenido de la pestaña de opciones */}
            <p>Pestaña de Opciones</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideRoomMenu;