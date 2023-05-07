import { useState, useEffect, useContext } from "react";
import { RoomContext, UserContext } from "./allContext";
import { useReducer } from "react"
import { roomReducer } from "../components/room/hooks/roomReducer";

export const RoomProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("chat-tab");
  const [activeRoom, setActiveRoom] = useState(null);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const [characterList, setCharacterList] = useState([]);
  const [templateList, setTemplateList] = useState([]);


  const { token, user } = useContext(UserContext);

  const initialState = {
    user: user,
    client: null,
    messages: [],
    ownPlayer: null,
    loadingChat: true,
    loadingOwnPlayer: true,
  };

  const [roomData, dispatch] = useReducer(roomReducer, initialState)


  const sendChatMessage = (data) => {
    const action = {
      type: 'send_chat_message',
      payload: data
    }
    dispatch(action);
  }

  const setChatMessages = (messages) => {
    const action = {
      type: 'set_chat_messages',
      payload: messages
    }
    dispatch(action);
  }

  const setChatClient = (client) => {
    const action = {
      type: 'set_chat_client',
      payload: client
    }
    dispatch(action);
  }


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://172.18.0.2:8000/api/room/${activeRoom.id}/chat/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const data = await response.json();
        dispatch({ type: 'set_chat_messages', payload: data?.messages || [] });
      } catch (error) {
        console.error(error);
        dispatch({ type: 'set_chat_messages', payload: [] });
      } finally {
        dispatch({ type: 'set_chat_loading', payload: false });
      }
    };

    const fetchOwnPlayer = async () => {
      try {
        const response = await fetch(
          `http://172.18.0.2:8000/api/room/${activeRoom.id}/my-player/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const data = await response.json();
        dispatch({ type: 'set_own_player', payload: data[0] || null });
      } catch (error) {
        console.error(error);
        dispatch({ type: 'set_own_player', payload: null });
      } finally {
        dispatch({ type: 'set_own_player_loading', payload: false });
      }
    };

    const getClient = async () => {
      try {
        const newClient = new WebSocket(
          `ws://172.18.0.2:8000/ws/room/${activeRoom.id}/`
        );
        newClient.onmessage = (returned) => {
          const returnedData = JSON.parse(returned.data);

          if (returnedData.type == 'message') {
            dispatch({ type: 'set_chat_messages', payload: returnedData.text_data || [] });
          }
          
        };
        dispatch({ type: 'set_chat_client', payload: newClient || null });
      } catch (error) {
        console.error(error);
        dispatch({ type: 'set_chat_client', payload: null });
      } finally {
        dispatch({ type: 'set_chat_client_loading', payload: false });
      }
    }

    if (activeRoom) {
      dispatch({ type: 'set_chat_client_loading', payload: true });
      dispatch({ type: 'set_chat_loading', payload: true });
      dispatch({ type: 'set_own_player_loading', payload: true });

      getClient();
      fetchMessages();
      fetchOwnPlayer();
    }
  }, [activeRoom]);



  useEffect(() => {
    console.log(roomData)
  }, [roomData.user, roomData.client, roomData.messages, roomData.ownPlayer]);
















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
        sendChatMessage,
        setChatMessages,
        setChatClient,
        roomData,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
