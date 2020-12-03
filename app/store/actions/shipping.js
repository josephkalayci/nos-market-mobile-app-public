export const SET_SHIPPING = 'SET_SHIPPING';
export const SET_SHIPPING_LOADING = 'SET_SHIPPING_LOADING';

export const fetchShippingRate = (postalCode) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch({
          type: SET_SHIPPING,
          methods: [
            {
              method_id: 'free_shipping',
              enabled: true,
              min_amount: 40,
            },
            {
              method_id: 'flat_rate',
              enabled: true,
              cost: 10,
            },
            {
              method_id: 'local_pickup',
              enabled: true,
            },
          ],
          lastUpdated: Date.now(),
        });

        //reject(new Error('fail'));
        resolve('Success!');
      }, 2000);
    });
  };
};
