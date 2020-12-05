import axios from '../../api/axios';
import { fetchShippingRate } from './shipping';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS';

export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const SET_SHIPPING_ADDRESS = 'SET_SHIPPING_ADDRESS';
export const SET_BILLING_ADDRESS = 'SET_BILLING_ADDRESS';
export const SET_BILLING_SAME_AS_SHIPPING = 'SET_BILLING_SAME_AS_SHIPPING';

export const loginSuccess = (token, user) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_SUCCESS,
      token: token,
      user: user,
    });
  };
};

export const signOut = () => {
  return (dispatch) => {
    dispatch({
      type: SIGNOUT_SUCCESS,
    });
  };
};

export const setShippingAddress = (value) => {
  return (dispatch, getState) => {
    const user = getState().user;

    //if auth user update user info at backend
    if (user.isAuth) {
      return axios
        .patch(
          `users/${user.details.id}`,
          { shipping: value },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
        .then((response) => {
          if (response.status !== 200) {
            return Promise.reject(response);
          }
          dispatch({ type: SET_SHIPPING_ADDRESS, value: value });
          return response;
        });
    } else {
      return new Promise.resolve().then(
        dispatch({ type: SET_SHIPPING_ADDRESS, value: value })
      );
    }
  };
};

export const setBillingAddress = (value) => {
  return (dispatch, getState) => {
    const user = getState().user;
    //if auth user update user info at backend
    if (user.isAuth) {
      return axios
        .patch(
          `users/${user.details.id}`,
          { billing: value },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
        .then((response) => {
          if (response.status !== 200) {
            return Promise.reject(response);
          }
          dispatch({ type: SET_BILLING_ADDRESS, value: value });
          return response;
        });
    } else {
      return new Promise.resolve().then(
        dispatch({ type: SET_BILLING_ADDRESS, value: value })
      );
    }
  };
};

export const setBillingSameAsShipping = (value) => {
  return { type: SET_BILLING_SAME_AS_SHIPPING, value: value };
};
