import React from 'react';
import { Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

//Galio imports
import { Block } from 'galio-framework';

//custom components
import Text from './Text';

//Assets
import errorImage from '../assets/images/error.png';
import Button from './Buttons/Button';

const { width } = Dimensions.get('window');
const ErrorView = ({ onErrorFallback, isLoading, ...rest }) => {
  return (
    <Block flex safe>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        {...rest}
      >
        <Block flex center style={{ marginTop: 16 }}>
          <Image source={errorImage} style={styles.image} />

          <Text muted>{'Opps, something went wrong.'}</Text>
          <Button
            round
            loading={isLoading}
            color='rgb(237,102,97)'
            onPress={onErrorFallback}
            style={styles.button}
          >
            {'Try again'}
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: { flexGrow: 1 },
  image: {
    width: width,
    height: width / 1.15,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  button: { shadowColor: '#c12e35', marginTop: 16 },
});

export default ErrorView;
