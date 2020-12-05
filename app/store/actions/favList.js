import { showNotification } from './notification';

export const ADD_TO_FAV_LIST = 'ADD_TO_FAV_LIST';
export const REMOVE_FROM_FAV_LIST = 'REMOVE_FROM_FAV_LIST';
export const SET_SORT_CRITERIA = 'SET_SORT_CRITERIA';

export const addToFavList = (productId) => {
  return (dispatch) => {
    dispatch(
      showNotification({
        animation: 'heart',
        duration: 1000,
      })
    );
    dispatch({ type: ADD_TO_FAV_LIST, productId: productId });
  };
};

export const removeFromFavList = (productId) => {
  return { type: REMOVE_FROM_FAV_LIST, productId: productId };
};

export const setSortCriteria = (val) => {
  return { type: SET_SORT_CRITERIA, data: val };
};
