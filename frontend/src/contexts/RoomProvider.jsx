import { useState, useEffect, useContext } from "react";
import { RoomContext, UserContext } from "./allContext";
import { useReducer } from "react"
import { roomReducer } from "../components/room/hooks/roomReducer";
import Pusher from 'pusher-js';

const ws_backend_url = import.meta.env.VITE_WS_URL;
const backend_url = import.meta.env.VITE_API_URL;
const frontend_url = import.meta.env.VITE_HOST_URL;

const PUSHER_ID = import.meta.env.VITE_PUSHER_ID;
const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
const PUSHER_SECRET = import.meta.env.VITE_PUSHER_SECRET;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;

export const RoomProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("chat-tab");
  const [activeRoom, setActiveRoom] = useState(null);


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
    roomOwner: activeRoom?.owner,
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

    // change room owner with dispatch if not Null and not equal to current owner
    const changeRoomOwner = () => {
      if (activeRoom?.owner && activeRoom?.owner != roomData.roomOwner) {
        const action = {
          type: 'set_room_owner',
          payload: activeRoom?.owner
        }
        dispatch(action);
      }
    }


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

    // const getClient = async () => {
    //   try {
    //     const newClient = new WebSocket(
    //       `${ws_backend_url}/ws/room/${activeRoom.id}/`
    //     );
    //     newClient.onmessage = (returned) => {
    //       const returnedData = JSON.parse(returned.data);

    //       if (returnedData.type == 'message') {
    //         dispatch({ type: 'set_chat_messages', payload: returnedData.text_data || [] });
    //       }

    //       if (returnedData.type == 'character') {
    //         dispatch({ type: 'set_character', payload: returnedData.text_data || [] });
    //       }

    //     };
    //     dispatch({ type: 'set_chat_client', payload: newClient || null });
    //   } catch (error) {
    //     console.error(error);
    //     dispatch({ type: 'set_chat_client', payload: null });
    //   } finally {
    //     dispatch({ type: 'set_chat_client_loading', payload: false });
    //   }
    // }


    const getClient = async () => {
      try {
        let newClient;
        if (PUSHER_ID && PUSHER_KEY && PUSHER_SECRET && PUSHER_CLUSTER) {

          const pusherClient = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER,
            authEndpoint: `${backend_url}/api/pusher/auth/`,
            auth: {
              headers: {
                Authorization: `Token ${token}`, // Utiliza el token de autenticación recibido desde el servidor
              },
            },
          });
          
          newClient = pusherClient.subscribe(`private-room-${activeRoom.id}`);
          newClient.bind('message', (data) => {
            dispatch({ type: 'set_chat_messages', payload: data || [] });
          });
          newClient.bind('character', (data) => {
            dispatch({ type: 'set_character', payload: data || [] });
          });

        } else {
          console.log('No se pudo conectar a Pusher')
          newClient = new WebSocket(`${ws_backend_url}/ws/room/${activeRoom.id}/`);
          newClient.onmessage = (returned) => {
            const returnedData = JSON.parse(returned.data);

            if (returnedData.type === 'message') {
              dispatch({ type: 'set_chat_messages', payload: returnedData.text_data || [] });
            }

            if (returnedData.type === 'character') {
              dispatch({ type: 'set_character', payload: returnedData.text_data || [] });
            }
          };
        }
        dispatch({ type: 'set_chat_client', payload: newClient || null });
      } catch (error) {
        console.error(error);
        dispatch({ type: 'set_chat_client', payload: null });
      } finally {
        dispatch({ type: 'set_chat_client_loading', payload: false });
      }
    };

    if (activeRoom) {
      dispatch({ type: 'set_chat_client_loading', payload: true });
      dispatch({ type: 'set_chat_loading', payload: true });
      dispatch({ type: 'set_own_player_loading', payload: true });
      dispatch({ type: 'set_room_directories_loading', payload: true });

      getClient();
      fetchMessages();
      fetchOwnPlayer();
      fetchDirectories();
      changeRoomOwner()

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
        fetchOwnPlayer,
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
