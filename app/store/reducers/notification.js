import { SET_NOTIFICATION, CLEAR_NOTIFICATION } from '../actions/notification';

const initialState = {
  message: '',
  messageType: '',
  animation: '',
  duration: '',
  id: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        message: action.message,
        messageType: action.messageType,
        animation: action.animation,
        duration: action.duration,
        id: action.id,
      };

    case CLEAR_NOTIFICATION:
      return {
        message: '',
        messageType: '',
        animation: '',
        duration: '',
        id: '',
      };
  }

  return state;
};
