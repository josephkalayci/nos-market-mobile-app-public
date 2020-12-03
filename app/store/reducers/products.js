import {
  ADD_PRODUCT,
  SET_ITEMS,
  ADD_CARAUSEL_PRODUCTS,
  ADD_FIRST_ROW_PRODUCTS,
  ADD_SECOND_ROW_PRODUCTS,
} from '../actions/products';

const initialState = {
  byId: {},
  allIds: [],
  carauselAllIds: [],
  firstRowAllIds: [],
  secondRowAllIds: [],
};

const addProduct = (state, action) => {
  const { data, productId } = action;
  let isExist = state.byId[productId] ? true : false;

  return {
    ...state,
    byId: {
      ...state.byId,
      [productId]: {
        data: data,
        updatedAt: Date.now(),
      },
    },
    allIds: isExist ? [...state.allIds] : [...state.allIds, productId],
  };
};

const addProducts = (state, action) => {
  //data comes in array format
  const { data } = action;

  //convert array to object
  let temp = {};
  let tempIds = [];
  const date = Date.now();
  for (var i = 0; i < data.length; i++) {
    let isExist = state.byId[data[i].id] ? true : false;
    if (!isExist) {
      tempIds.push(data[i].id);
    }
    temp[data[i].id] = {
      data: data[i],
      updatedAt: date,
    };
  }
  return {
    ...state,
    byId: {
      ...state.byId,
      ...temp,
    },
    allIds: [...state.allIds, ...tempIds],
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT:
      return addProduct(state, action);
    case SET_ITEMS:
      return addProducts(state, action);
    case ADD_CARAUSEL_PRODUCTS:
      return {
        ...state,
        carauselAllIds: [...action.data],
      };
    case ADD_FIRST_ROW_PRODUCTS:
      return {
        ...state,
        firstRowAllIds: [...action.data],
      };
    case ADD_SECOND_ROW_PRODUCTS:
      return {
        ...state,
        secondRowAllIds: [...action.data],
      };

    default:
      return state;
  }
};
