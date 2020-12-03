import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  PLACE_ORDER,
  UPDATE_STATS,
} from '../actions/lineItems';

const initialState = {
  byId: {},
  allIds: [],
  totalProductCost: 0,
  totalTax: 0,
};

const addToCart = (state, action) => {
  const { productId } = action;
  let isExist = state.byId[productId] ? true : false;

  return {
    ...state,
    byId: {
      ...state.byId,
      [productId]: {
        product_id: action.productId,
        quantity: isExist
          ? Number(state.byId[productId].quantity) + Number(action.quantity)
          : Number(action.quantity),
      },
    },
    allIds: isExist ? [...state.allIds] : [...state.allIds, productId],
  };
};
const removeFromCart = (state, action) => {
  const { [action.productId]: val, ...withoutRemovedItem } = state.byId;
  return {
    ...state,
    byId: {
      ...withoutRemovedItem,
    },
    allIds: state.allIds.filter((id) => id != action.productId),
  };
};
const updateQuantity = (state, action) => {
  const { productId } = action;
  return {
    ...state,
    byId: {
      ...state.byId,
      [productId]: {
        ...state.byId[productId],
        quantity: Number(action.quantity),
      },
    },
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      return addToCart(state, action);
    }
    case REMOVE_FROM_CART: {
      return removeFromCart(state, action);
    }
    case UPDATE_QUANTITY: {
      return updateQuantity(state, action);
    }
    case UPDATE_STATS: {
      return {
        ...state,
        totalTax: action.totalTax,
        totalProductCost: action.totalProductCost,
      };
    }
    case PLACE_ORDER:
      return {
        ...state,
        byId: {},
        allIds: [],
      };
  }

  return state;
};
