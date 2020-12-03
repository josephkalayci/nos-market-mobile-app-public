import * as actionTypes from '../actions/search';

const initialState = {
  result: [],
  searchTerm: '',
  isSearching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SEARCH_RESULT:
      return {
        ...state,
        isSearching: false,
        result: action.data,
      };
    case actionTypes.SET_IS_SEARCHING:
      return {
        ...state,
        isSearching: action.data,
      };
    case actionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        isSearching: true,
        searchTerm: action.data,

        //  isSearching: true,
      };
  }

  return state;
};
