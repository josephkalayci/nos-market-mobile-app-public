import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';

//Galio imports
import { Block, GalioProvider } from 'galio-framework';

//Redux related imports
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

//Navigation
import Screens from './app/navigation/Screens';
import { NavigationContainer } from '@react-navigation/native';

//Custom components
import materialTheme from './app/constants/Theme';
import Toast from './app/components/Toast';
import configureAppStore from './app/configureAppStore';
import configureNetInfo from './app/configureNetInfo';
import useInitApp from './app/hooks/useInitApp';

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
]);

enableScreens();

const { store, persistor } = configureAppStore();

configureNetInfo(store);

export default function App(props) {
  const isComplated = useInitApp(store);
  if (!isComplated) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <GalioProvider theme={materialTheme}>
            <Block flex>
              <Toast />
              {Platform.OS === 'ios' ? (
                <StatusBar barStyle='dark-content' />
              ) : (
                <StatusBar backgroundColor='white' barStyle='dark-content' />
              )}
              <Screens />
            </Block>
          </GalioProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({});
