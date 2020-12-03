import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { fetchMainCategories } from '../store/actions/categories';
import {
  fetchCarauselProducts,
  fetchFirstRowProducts,
  fetchSecondRowProducts,
} from '../store/actions/products';

import { fetchShippingRate } from '../store/actions/shipping';

export default function useInitApp(store) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  //Get carausel products
  //Get first row products
  //Get second row products
  //Update categories
  //Update shipping rate
  //Load fonts

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();
        store.dispatch({ type: 'SET_LOADING_STATE', payload: true });

        //Get latest shipping rates
        store.dispatch(fetchShippingRate()).catch((error) => {});
        //Fetch initial data
        Promise.all([
          store.dispatch(fetchMainCategories()),
          store.dispatch(fetchCarauselProducts()),
          store.dispatch(fetchFirstRowProducts()),
          store.dispatch(fetchSecondRowProducts()),
        ])
          .then(() => {
            store.dispatch({ type: 'SET_LOADING_STATE', payload: false });
          })
          .catch((error) => {
            console.log(error);
            store.dispatch({ type: 'SET_LOADING_ERROR', payload: true });
            store.dispatch({ type: 'SET_LOADING_STATE', payload: false });
          });

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'galio-extra': require('../assets/fonts/galioExtra.ttf'),
          TruenoSBd: require('../assets/fonts/TruenoSBd.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        store.dispatch({ type: 'SET_LOADING_ERROR', payload: true });
        store.dispatch({ type: 'SET_LOADING_STATE', payload: false });
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        //wait two second
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
