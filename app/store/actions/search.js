export const SET_IS_SEARCHING = 'SET_IS_SEARCHING';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SET_SEARCH_RESULT = 'SET_SEARCH_RESULT';
export const SET_ITEMS = 'SET_ITEMS';
import axios from '../../api/axios';

//SEARCH PRODUCTS
export const searchProducts = (searchTerm) => {
  return (dispatch) => {
    dispatch({
      type: SET_IS_SEARCHING,
      data: true,
    });
    return axios.get('products', { params: { search: searchTerm } });
  };
};
