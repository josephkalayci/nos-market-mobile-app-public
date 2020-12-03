export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export const showNotification = (message) => {
  return { type: SET_NOTIFICATION, message: message };
};

export const clearNotification = () => {
  return { type: CLEAR_NOTIFICATION };
};
