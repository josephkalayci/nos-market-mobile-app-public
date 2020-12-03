import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

//Custom components
import Text from '../../Text';

AddressView.propTypes = {
  address: PropTypes.string.isRequired,
};

export default function AddressView({ address }) {
  return <Text style={styles.address}>{address}</Text>;
}

const styles = StyleSheet.create({
  address: {
    color: '#7B7B7B',
    fontSize: 16,
    marginTop: 10,
  },
});
