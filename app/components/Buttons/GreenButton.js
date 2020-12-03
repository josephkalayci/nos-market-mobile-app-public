import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Button from './Button';

GreenButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default function GreenButton({ onPress, text, loading }) {
  return (
    <Button
      onPress={onPress}
      style={styles.button}
      shadowless
      loading={loading}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 0,
    padding: 0,
    alignItems: 'center',
    backgroundColor: '#24988D',
    borderRadius: 32,
    justifyContent: 'center',
    marginLeft: '3%',
    minHeight: 50,
    width: '30%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
