import { SET_CATEGORIES } from '../actions/categories';

const initialState = {
  categories: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.data,
      };
    default:
      return state;
  }
};
