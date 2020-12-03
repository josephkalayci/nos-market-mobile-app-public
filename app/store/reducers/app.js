const initialState = {
  hasNetworkError: true,
  isLoading: true,
  hasLoadingError: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NETWORK_STATUS':
      return {
        ...state,
        hasNetworkError: action.payload,
      };
    case 'SET_LOADING_ERROR':
      return {
        ...state,
        hasLoadingError: action.payload,
      };
    case 'SET_LOADING_STATE':
      return {
        ...state,
        isLoading: action.payload,
      };
  }

  return state;
};
