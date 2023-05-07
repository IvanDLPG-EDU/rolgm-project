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
    case 'send_chat_message':
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

    default:
      return state;
  }
};