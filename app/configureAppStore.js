import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { cartMiddleware } from './store/middlewares';
import thunkMiddleware from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';

import rootReducer from './store/reducers/rootReducer';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

export default function configureAppStore() {
  const persistConfig = {
    key: 'root',
    whitelist: ['favList', 'lineItems', 'shipping', 'user', 'categories'],
    storage: AsyncStorage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: [
      thunkMiddleware,
      cartMiddleware,
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        immutableCheck: false,
        serializableCheck: false,
      }),
    ],
    devTools: true,
  });

  const persistor = persistStore(store);

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../store/reducers/rootReducer', () =>
      store.replaceReducer(rootReducer)
    );
  }

  return { store, persistor };
}
