import { showNotification } from './notification';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const PLACE_ORDER = 'PLACE_ORDER';
export const UPDATE_STATS = 'UPDATE_STATS';
// default value for quantity is 1
export const addToCart = (productId, quantity = 1) => {
  return (dispatch, getState) => {
    const product = getState().products.byId[productId]?.data;
    const quantityInCart = getState().lineItems.byId[productId]?.quantity || 0;

    if (!product.manage_stock) {
      dispatch({ type: ADD_TO_CART, productId: productId, quantity: quantity });
      dispatch(showNotification({ animation: 'cart', duration: 1500 }));
      return;
    }

    if (product.stock_status !== 'instock' || !product.stock_quantity) {
      //do nothing
      return;
    }

    if (quantity + quantityInCart <= product.stock_quantity) {
      dispatch({ type: ADD_TO_CART, productId: productId, quantity: quantity });
      dispatch(showNotification({ animation: 'cart', duration: 1500 }));
      return;
    }

    if (quantity + quantityInCart > product.stock_quantity) {
      dispatch({
        type: ADD_TO_CART,
        productId: productId,
        quantity: Math.max(0, product.stock_quantity - quantityInCart),
      });
      dispatch(
        showNotification({
          animation: 'cart',
          duration: 1500,
          message: 'All available items in your cart',
          messageType: 'warning',
        })
      );
      return;
    }
  };
};

export const removeFromCart = (productId) => {
  return { type: REMOVE_FROM_CART, productId: productId };
};

export const updateQuantity = (productId, quantity) => {
  return { type: UPDATE_QUANTITY, productId: productId, quantity: quantity };
};

export const updateStats = ({ totalQuantity, totalTax, totalProductCost }) => {
  return {
    type: UPDATE_STATS,
    totalTax: totalTax,
    totalProductCost: totalProductCost,
  };
};

//PLACE ORDER returns order id
export const placeOrder = (nonce, amount, orderData) => {
  return (dispatch) => {
    dispatch({
      type: PLACE_ORDER,
    });
  };
};
