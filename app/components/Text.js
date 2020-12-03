import React from 'react';
import { StyleSheet } from 'react-native';

import { Text as GalioText } from 'galio-framework';

const Text = ({ style, children, ...rest }) => {
  return (
    <GalioText style={[styles.text, style]} {...rest}>
      {children}
    </GalioText>
  );
};
export default Text;
const styles = StyleSheet.create({
  text: {},
});
