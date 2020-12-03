import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

//Custom components
import Text from '../../Text';

OrderInformationDescriptionView.propTypes = {
  description: PropTypes.string.isRequired,
};

export default function OrderInformationDescriptionView({ description }) {
  return <Text style={styles.description}>{description}</Text>;
}

const styles = StyleSheet.create({
  description: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
