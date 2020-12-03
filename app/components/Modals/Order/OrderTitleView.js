import React from 'react';
import { View, StyleSheet, TouchableHighlight, Image } from 'react-native';
import PropTypes from 'prop-types';

//Custom components
import Text from '../../Text';

const closeButton = require('../../../assets/images/btnClose.png');

OrderTitleView.propTypes = {
  onCloseOrderScreen: PropTypes.func.isRequired,
};

export default function OrderTitleView({ onCloseOrderScreen }) {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.closeButton}
        underlayColor='#FFFFFF'
        onPress={onCloseOrderScreen}
      >
        <Image style={styles.button} source={closeButton} />
      </TouchableHighlight>
      <Text style={styles.title}>Place your order</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    zIndex: 1,
    elevation: 1,
    borderRadius: 16,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  title: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    zIndex: 0,
  },
});
