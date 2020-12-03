import { combineReducers } from 'redux';
import productsReducer from './products';
import favListReducer from './favList';
import userReducer from './user';
import notificationReducer from './notification';
import searchReducer from './search';
import lineItemsReducer from './lineItems';
import shippingReducer from './shipping';
import categoriesReducer from './categories';
import app from './app';
const appReducer = combineReducers({
  app: app,
  user: userReducer,
  favList: favListReducer,
  products: productsReducer,
  notification: notificationReducer,
  search: searchReducer,
  lineItems: lineItemsReducer,
  shipping: shippingReducer,
  categories: categoriesReducer,
});

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === 'SIGNOUT_SUCCESS') {
    state.search = undefined;
    state.shipping = undefined;
    state.user = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
