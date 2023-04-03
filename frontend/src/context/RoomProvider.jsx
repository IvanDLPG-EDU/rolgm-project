import { useState } from 'react';
import { RoomContext } from './allContext'

export const RoomProvider = ({children}) => {

    const [activeTab, setActiveTab] = useState('chat-tab')

    const handleTabClick = (tabId) => {
        setActiveTab(tabId)
    }

    return (
        <RoomContext.Provider value={{activeTab,handleTabClick}}>
            {children}
        </RoomContext.Provider>
    )
}
