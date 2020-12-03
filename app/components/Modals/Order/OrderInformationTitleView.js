import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

//Custom components
import Text from '../../Text';

OrderInformationTitleView.propTypes = {
  title: PropTypes.string.isRequired,
};

export default function OrderInformationTitleView({ title }) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: '#24988D',
    fontSize: 16,
  },
});
