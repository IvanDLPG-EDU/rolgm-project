export const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set_chat_client':
      return {
        ...state,
        client: action.payload
      };
    case 'set_own_player':
      return {
        ...state,
        ownPlayer: action.payload
      };

    case 'send_to_server':
      action.payload.client.send(JSON.stringify({ data: action.payload.data }));

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