import { useState, useEffect, useContext } from "react";
import { RoomContext, UserContext } from "./allContext";
import { useReducer } from "react"
import { roomReducer } from "../components/room/hooks/roomReducer";

const ws_backend_url = import.meta.env.VITE_WS_URL;
const backend_url = import.meta.env.VITE_API_URL;

export const RoomProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("chat-tab");
  const [activeRoom, setActiveRoom] = useState(null);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const [templateList, setTemplateList] = useState([]);


  const { token, user } = useContext(UserContext);

  const initialState = {
    user: user,
    client: null,
    messages: [],
    ownPlayer: null,
    directories: {},
    loadingChat: true,
    loadingOwnPlayer: true,
    loadingDirectories: true,
  };

  const [roomData, dispatch] = useReducer(roomReducer, initialState)


  const sendToServer = (data) => {
    const action = {
      type: 'send_to_server',
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
          `${backend_url}/api/room/${activeRoom.id}/chat/`,
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
          `${backend_url}/api/room/${activeRoom.id}/my-player/`,
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

    const fetchDirectories = async () => {
      try {
        const response = await fetch(
          `${backend_url}/api/room/${activeRoom.id}/directories/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const data = await response.json();
        dispatch({ type: 'set_room_directories', payload: data.root_directory || null });
      } catch (error) {
        console.error(error);
        dispatch({ type: 'set_room_directories', payload: null });
      } finally {
        dispatch({ type: 'set_room_directories_loading', payload: false });
      }
    };

    const getClient = async () => {
      try {
        const newClient = new WebSocket(
          `${ws_backend_url}/ws/room/${activeRoom.id}/`
        );
        newClient.onmessage = (returned) => {
          const returnedData = JSON.parse(returned.data);

          if (returnedData.type == 'message') {
            dispatch({ type: 'set_chat_messages', payload: returnedData.text_data || [] });
          }

          if (returnedData.type == 'character') {
            dispatch({ type: 'set_character', payload: returnedData.text_data || [] });
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
      dispatch({ type: 'set_room_directories_loading', payload: true });

      getClient();
      fetchMessages();
      fetchOwnPlayer();
      fetchDirectories();

    }
  }, [activeRoom]);



  // useEffect(() => {
  //   console.log(roomData)
  // }, [roomData.user, roomData.client, roomData.messages, roomData.ownPlayer]);





  return (
    <RoomContext.Provider
      value={{
        activeTab,
        handleTabClick,
        setActiveRoom,
        activeRoom,
        templateList,
        setTemplateList,
        sendToServer,
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
