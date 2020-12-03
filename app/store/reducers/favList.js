import {
  ADD_TO_FAV_LIST,
  REMOVE_FROM_FAV_LIST,
  SET_SORT_CRITERIA,
} from '../actions/favList';

const initialState = {
  byId: {},
  allIds: [],
  sortBy: 'Default',
  sortOptions: ['Default', 'Price', 'Category'],
};

const addToFavList = (state, action) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.productId]: true,
    },
    allIds: [...state.allIds, action.productId],
  };
};

const removeFromFavList = (state, action) => {
  const { [action.productId]: val, ...withoutRemovedItem } = state.byId;
  return {
    ...state,
    byId: {
      ...withoutRemovedItem,
    },
    allIds: state.allIds.filter((el) => el !== action.productId),
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_FAV_LIST:
      return addToFavList(state, action);
    case REMOVE_FROM_FAV_LIST:
      return removeFromFavList(state, action);
    case SET_SORT_CRITERIA:
      return {
        ...state,
        sortBy: action.data,
      };
  }

  return state;
};
