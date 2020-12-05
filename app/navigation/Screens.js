import React from 'react';

//React navigation imports
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

//Galio imports
import { Icon } from 'galio-framework';

//Header and custom components
import Header from '../components/Header/Header.js';
import Colors from '../constants/Colors';
import ShoppingCartIcon from '../components/Icons/ShoppingCartIcon';

//Screens
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProductSearchScreen from '../screens/ProductSearchScreen';
import FavListScreen from '../screens/FavListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import PastPurchasesScreen from '../screens/PastPurchasesScreen';
import ShoppingCartScreen from '../screens/ShoppingCart/ShoppingCartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderScreen from '../screens/OrderScreen';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function HomeStack(props) {
  return (
    <Stack.Navigator initialRouteName='Home' mode='card' headerMode='screen'>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              chat
              search
              logo
              title='Home'
              navigation={navigation}
              scene={scene}
            />
          ),
          //cardStyle: { backgroundColor: 'white' },
        }}
      />
      <Stack.Screen
        name='Product'
        component={ProductScreen}
        options={{
          header: () => null,

          cardStyle: { backgroundColor: 'white' },
        }}
      />
      <Stack.Screen
        name='CategoryScreen'
        component={CategoryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title='Products'
              back
              logo
              search
              navigation={navigation}
              scene={scene}
            />
          ),

          cardStyle: { backgroundColor: 'white' },
        }}
      />
      <Stack.Screen
        name='ProductSearchScreen'
        component={ProductSearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title='Search'
              back
              search
              navigation={navigation}
              scene={scene}
            />
          ),

          cardStyle: { backgroundColor: 'white' },
        }}
      />
    </Stack.Navigator>
  );
}
function FavListStack(props) {
  return (
    <Stack.Navigator initialRouteName='favList' mode='card' headerMode='screen'>
      <Stack.Screen
        name='favList'
        component={FavListScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title='My List' navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: 'white' },
        }}
      />
      <Stack.Screen
        name='Product'
        component={ProductScreen}
        options={{
          header: () => null,

          cardStyle: { backgroundColor: 'white' },
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName='Settings'
      mode='modal'
      headerMode='screen'
    >
      <Stack.Screen
        name='You'
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title='You' navigation={navigation} scene={scene} />
          ),
          //cardStyle: { backgroundColor: 'white' },
        }}
      />
      <Stack.Screen
        name='PastPurchases'
        component={PastPurchasesScreen}
        options={{
          ...TransitionPresets[
            Platform.OS === 'ios'
              ? 'ModalPresentationIOS'
              : 'FadeFromBottomAndroid'
          ],
          header: ({ navigation, scene }) => (
            <Header title='Orders' navigation={navigation} scene={scene} />
          ),
          //cardStyle: { backgroundColor: 'white' },
        }}
      />
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{
          ...TransitionPresets[
            Platform.OS === 'ios'
              ? 'ModalPresentationIOS'
              : 'FadeFromBottomAndroid'
          ],
          header: ({ navigation, scene }) => (
            <Header title='Login' back navigation={navigation} scene={scene} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ShoppingCartStack(props) {
  return (
    <Stack.Navigator initialRouteName='Cart' mode='modal' headerMode='screen'>
      <Stack.Screen
        name='Cart'
        component={ShoppingCartScreen}
        options={{
          header: ({ navigation }) => (
            <Header title='Shopping Cart' navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name='CheckoutScreen'
        component={CheckoutScreen}
        options={{
          cardStyle: { backgroundColor: 'white' },
          header: () => null,
          ...TransitionPresets[
            Platform.OS === 'ios'
              ? 'ModalPresentationIOS'
              : 'FadeFromBottomAndroid'
          ],
        }}
      />
      <Stack.Screen
        name='OrderScreen'
        component={OrderScreen}
        options={{
          header: () => null,

          cardStyle: { backgroundColor: 'white' },
        }}
      />
    </Stack.Navigator>
  );
}

const customTabBarStyle = {
  style: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    //top: 1,
    //bottom: 222,
  },
};

function BottomTabNavigator(props) {
  return (
    <BottomTab.Navigator
      initialRouteName='Home'
      mode='card'
      headerMode='screen'
      tabBarOptions={{
        keyboardHidesTabBar: true,
        ...customTabBarStyle,
      }}
    >
      <BottomTab.Screen
        name='Home'
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name='md-home'
              family='Ionicon'
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
              size={30}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name='MyList'
        component={FavListStack}
        options={{
          title: 'My List',
          tabBarIcon: ({ focused }) => (
            <Icon
              name='ios-heart-empty'
              family='Ionicon'
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
              size={30}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name='Settings'
        component={SettingsStack}
        options={{
          title: 'You',
          tabBarIcon: ({ focused }) => (
            <Icon
              name='ios-contact'
              family='Ionicon'
              color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
              size={30}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name='Bag'
        component={ShoppingCartStack}
        options={({ navigation, route }) => {
          return {
            title: 'Bag',
            tabBarIcon: ({ focused }) => <ShoppingCartIcon focused={focused} />,
            //Hide BottomTab on Order Placed Screen
            tabBarVisible:
              getFocusedRouteNameFromRoute(route) === 'OrderScreen'
                ? false
                : true,
          };
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function AppStack(props) {
  return <BottomTabNavigator />;
}
