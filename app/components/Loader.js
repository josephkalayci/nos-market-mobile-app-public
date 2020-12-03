import React from 'react';
import LottieView from 'lottie-react-native';

const Loader = ({ ...rest }) => {
  return (
    <LottieView
      source={require('../assets/animations/loading.json')}
      autoPlay
      loop
      {...rest}
    />
  );
};

export default Loader;
