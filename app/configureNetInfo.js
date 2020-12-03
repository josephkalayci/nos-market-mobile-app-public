import NetInfo from '@react-native-community/netinfo';

export default function configureNetInfo(store) {
  NetInfo.configure({
    reachabilityUrl: 'https://clients3.google.com/generate_204',
    reachabilityTest: async (response) => response.status === 204,
    reachabilityLongTimeout: 60 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
  });

  NetInfo.addEventListener((state) => {
    store.dispatch({ type: 'SET_NETWORK_STATUS', payload: !state.isConnected });
  });
}
