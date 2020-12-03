import * as actionTypes from '../actions/user';

const initState = {
  isAuth: false,
  token: '',
  billingSameAsShipping: true,
  details: { shipping: { postcode: '' } },
};

export default (state = initState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuth: true,
        token: action.token,
        details: { ...action.user },
      };
    //this action defined in root reducer and resets all states in redux
    //case actionTypes.SIGNOUT_SUCCESS:
    case actionTypes.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.value,
      };
    case actionTypes.SET_SHIPPING_ADDRESS:
      return {
        ...state,
        details: { ...state.details, shipping: action.value },
      };
    case actionTypes.SET_BILLING_ADDRESS:
      return {
        ...state,
        details: { ...state.details, billing: action.value },
      };
    case actionTypes.SET_BILLING_SAME_AS_SHIPPING: {
      return {
        ...state,
        billingSameAsShipping: action.value,
      };
    }
    default:
      return state;
  }
};
