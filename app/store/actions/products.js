export const SET_ITEMS = 'SET_ITEMS';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const ADD_PRODUCT = 'ADD_PRODUCT';

export const ADD_CARAUSEL_PRODUCTS = 'ADD_CARAUSEL_PRODUCT';
export const ADD_FIRST_ROW_PRODUCTS = 'ADD_FIRST_ROW_PRODUCTS';
export const ADD_SECOND_ROW_PRODUCTS = 'ADD_SECOND_ROW_PRODUCTS';

import AppConfig from '../../constants/Config';
import axios from '../../api/axios';

//FETCH SINGLE PRODUCTS
export const fetchSingleProduct = (productId) => {
  return (dispatch) => {
    return axios
      .get(`products/${productId}`)
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(response);
        }
        return response;
      })
      .then((response) => {
        dispatch({
          type: ADD_PRODUCT,
          data: response.data,
          productId: productId,
        });
      });
  };
};

//GENERIC FETH FUNCTION
export const fetchProducts = (options = {}) => {
  return (dispatch) => {
    return axios.get('products', { params: options }).then((response) => {
      dispatch({
        type: SET_ITEMS,
        data: response.data,
      });
      return response;
    });
  };
};

//FETCH CARAUSEL PRODUCTS
export const fetchCarauselProducts = () => {
  return (dispatch) => {
    return axios
      .get('/products', {
        params: {
          category: AppConfig.HomePage.carausel.categoryId,
          per_page: 6,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(response);
        }
        return response;
      })
      .then((response) => {
        dispatch({
          type: SET_ITEMS,
          data: response.data,
        });
        dispatch({
          type: ADD_CARAUSEL_PRODUCTS,
          data: response.data.map((el) => el.id),
        });
      });
  };
};

//FETCH FIRST ROW PRODUCTS
export const fetchFirstRowProducts = () => {
  return (dispatch) => {
    return axios
      .get('products', {
        params: {
          //category: AppConfig.HomePage.firstRow.categoryId,
          featured: true,
          per_page: 6,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(response);
        }
        return response;
      })
      .then((response) => {
        dispatch({
          type: SET_ITEMS,
          data: response.data,
        });
        dispatch({
          type: ADD_FIRST_ROW_PRODUCTS,
          data: response.data.map((el) => el.id),
        });
      });
  };
};

//FETCH SECOND ROW PRODUCTS
export const fetchSecondRowProducts = () => {
  return (dispatch) => {
    return axios
      .get('products', {
        params: {
          category: AppConfig.HomePage.secondRow.categoryId,
          per_page: 6,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(response);
        }
        return response;
      })
      .then((response) => {
        dispatch({
          type: SET_ITEMS,
          data: response.data,
        });
        dispatch({
          type: ADD_SECOND_ROW_PRODUCTS,
          data: response.data.map((el) => el.id),
        });
      });
  };
};
