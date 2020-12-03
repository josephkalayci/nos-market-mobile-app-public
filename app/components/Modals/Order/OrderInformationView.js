import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

//Custom components
import Text from '../../Text';

OrderInformationView.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default function OrderInformationView({ title, description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '10%',
    marginRight: '10%',
    width: '80%',
  },
  description: {
    borderColor: '#123456',
    borderWidth: 2,
    flex: 1,
  },
  title: {
    flex: 1,
    fontSize: 18,
  },
});
