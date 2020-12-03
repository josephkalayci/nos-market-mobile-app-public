import * as React from 'react';
import { StyleSheet } from 'react-native';

//Galio imports
import { Block, Icon } from 'galio-framework';

//Redux related imports
import { useSelector } from 'react-redux';
import { getTotalItemQuantityInCart } from '../../store/selectors';

//Custom components
import Text from '../Text';
import Colors from '../../constants/Colors';

//Other imports
import PropTypes from 'prop-types';

const textBackgroundColor = 'rgb(237,102,97)';

export default function ShoppingCartIcon({ focused }) {
  //Total item quantity in cart
  const itemCount = useSelector(getTotalItemQuantityInCart);

  return (
    <Block>
      <Icon
        name='ios-cart'
        family='Ionicon'
        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        size={30}
        style={styles.icon}
      />
      <Block middle style={[styles.itemCountContainer]}>
        <Text size={12} style={styles.text} numberOfLines={1}>
          {itemCount}
        </Text>
      </Block>
    </Block>
  );
}

ShoppingCartIcon.defaultProps = {
  focused: true,
};

ShoppingCartIcon.propTypes = {
  focused: PropTypes.bool,
};

const styles = StyleSheet.create({
  icon: { marginBottom: -3 },
  itemCountContainer: {
    position: 'absolute',
    flexWrap: 'nowrap',
    top: 1,
    right: -16,
    minWidth: 20,
    minHeight: 20,
    padding: 1,
    borderRadius: 10,
    backgroundColor: textBackgroundColor,
  },
  text: {
    fontWeight: '600',
  },
});
