import { SET_NOTIFICATION, CLEAR_NOTIFICATION } from '../actions/notification';

const initialState = {
  message: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        message: action.message,
      };

    case CLEAR_NOTIFICATION:
      return {
        ...state,
        message: '',
      };
  }

  return state;
};
