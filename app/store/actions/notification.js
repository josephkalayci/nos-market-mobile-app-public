import { v4 as uuidv4 } from 'uuid';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export const showNotification = ({
  message,
  messageType,
  animation,
  duration,
}) => {
  return {
    type: SET_NOTIFICATION,
    message: message,
    messageType: messageType,
    animation: animation,
    duration: duration,
    id: uuidv4(),
  };
};

export const clearNotification = () => {
  return { type: CLEAR_NOTIFICATION };
};
