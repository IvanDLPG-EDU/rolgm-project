import Pusher from 'pusher-js';

export const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set_chat_client':
      return {
        ...state,
        chatClients: {
          ...state.chatClients,
          [action.payload.roomId]: action.payload && action.payload.client ? action.payload.client : action.payload
        }
      };
    case 'set_own_player':
      return {
        ...state,
        ownPlayer: action.payload
      };

    case 'set_room_directories':
      return {
        ...state,
        directories: action.payload
      };

      case 'send_to_server':
        const { roomId, data } = action.payload;
        const client = state.chatClients[roomId];
  
        console.log('send_to_server', client)
        console.log('send_to_server', data)

        if (client instanceof WebSocket) {
          client.send(JSON.stringify({ data }));
        } else {
          const eventName = "client-" + data.type;
          const eventData = { data };
          client.trigger(eventName, eventData);
        }

        return {
          ...state
        };
  

    case 'set_chat_messages':
      let newMessages = [];
      if (Array.isArray(action.payload)) {
        newMessages = action.payload;
      } else if (typeof action.payload === 'object' && action.payload !== null) {
        newMessages = [action.payload];
      }
      return {
        ...state,
        messages: [...state.messages, ...newMessages]
      };

    case 'set_chat_client_loading':
      return {
        ...state,
        loadingClient: action.payload
      };

    case 'set_chat_loading':
      return {
        ...state,
        loadingChat: action.payload
      };

    case 'set_own_player_loading':
      return {
        ...state,
        loadingOwnPlayer: action.payload
      };
    
    case 'set_room_directories_loading':
      return {
        ...state,
        loadingDirectories: action.payload
      };

    case 'set_character':
      let newCharacters = [];
      if (Array.isArray(action.payload)) {
        newCharacters = action.payload;
      } else if (typeof action.payload === 'object' && action.payload !== null) {
        newCharacters = [action.payload];
      }

      const updatedCharacters = newCharacters.reduce((acc, newCharacter) => {
        const existingCharacterIndex = acc.findIndex(c => c.id === newCharacter.id);
        if (existingCharacterIndex !== -1) {
          acc[existingCharacterIndex] = { ...acc[existingCharacterIndex], ...newCharacter };
        } else {
          acc.push(newCharacter);
        }
        return acc;
      }, [...state.ownPlayer.characters]);


      return {
        ...state,
        ownPlayer: {
          ...state.ownPlayer,
          characters: updatedCharacters
        }
      };

    default:
      return state;
  }
};