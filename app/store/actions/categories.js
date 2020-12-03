export const SET_CATEGORIES = 'SET_CATEGORIES';

import axios from '../../api/axios';

//FETCH MAIN CATEGORIES
export const fetchMainCategories = () => {
  return (dispatch) => {
    return axios
      .get('categories', {
        params: {
          per_page: 100,
          parent: 0,
          hide_empty: true,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(response);
        }

        return response;
      })
      .then((response) => {
        const responseData = response.data.map((el) => ({
          id: el.id,
          name: el.name,
          count: el.count,
        }));
        const featuredCategory = { id: 'featured', name: 'Featured' };

        dispatch({
          type: SET_CATEGORIES,
          data: [featuredCategory, ...responseData],
        });
      });
  };
};
