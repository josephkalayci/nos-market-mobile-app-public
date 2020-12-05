import React from 'react';
import { StyleSheet, Dimensions, Vibration, Image } from 'react-native';
//Galio imports
import { Block } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as lineItemActions from '../../store/actions/lineItems';
import * as favListActions from '../../store/actions/favList';

//Custom components
import Text from '../Text';

//Other imports
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';
import Button from '../Buttons/Button';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const width = Dimensions.get('window').width;

const favButtonColor = 'rgb(237,102,97)';

const CheckoutCard = ({ productId, ...rest }) => {
  const dispatch = useDispatch();

  //Check if product is in favurite list
  const isFavourite = useSelector((state) => state.favList.byId[productId]);

  //Get item from store
  const item = useSelector((state) => state.products.byId[productId]?.data);

  //Get item quantity in cart
  const quantity = useSelector(
    (state) => state.lineItems.byId[productId].quantity
  );

  //Remove button handler
  const handleRemoveFromCart = () => {
    dispatch(lineItemActions.removeFromCart(productId));
    ReactNativeHapticFeedback.trigger('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  //Quantity input handler
  const handleQuantityChange = (quantity) => {
    dispatch(lineItemActions.updateQuantity(productId, quantity));
  };

  //Fav button handler
  const handleToggleFavState = () => {
    if (isFavourite) {
      dispatch(favListActions.removeFromFavList(productId));
    } else {
      dispatch(favListActions.addToFavList(productId));
      ReactNativeHapticFeedback.trigger('notificationSuccess', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  };

  const getMaximumQuantity = () => {
    //if there is no stock management set maximum 100
    if (!item.manage_stock) {
      return Number(quantity) + 100;
    }

    if (item.stock_status !== 'instock' || !item.stock_quantity) {
      return 0;
    }

    return item.stock_quantity;
  };

  //Return null if item doesn't exist in store
  if (!item) {
    return null;
  }

  return (
    <Block style={styles.root} {...rest}>
      {/* Product image, title and price */}

      <Block row flex>
        {/* Product image */}
        <Block flex={1}>
          <Image
            source={{ uri: item.images[0]?.src }}
            style={styles.productImage}
          />
        </Block>
        {/* Product title and price */}
        <Block flex={3} style={styles.productInfoContainer}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.name}
          </Text>

          {item.on_sale ? (
            <React.Fragment>
              <Text style={styles.price}>{`$${item.sale_price}`}</Text>
              <Text muted style={styles.salePriceContainer}>
                {`Was $`}
                <Text style={styles.salePrice}>{item.regular_price}</Text>
              </Text>
            </React.Fragment>
          ) : (
            <Text style={styles.price}>{`$${item.regular_price}`}</Text>
          )}
        </Block>
      </Block>

      {/* Action buttons */}
      <Block row middle flex space='between'>
        {/* Remove button */}
        <Button
          color='#fff'
          onPress={handleRemoveFromCart}
          shadowless
          style={styles.removeButton}
        >
          <Text>Remove</Text>
        </Button>

        {/* Quantity input */}
        <Block row middle style={styles.quantityButton}>
          <Text>Qty</Text>
          <RNPickerSelect
            onValueChange={handleQuantityChange}
            placeholder={{}}
            value={String(quantity)}
            items={Array.from(Array(getMaximumQuantity()).keys()).map((el) => ({
              label: String(el + 1),
              value: String(el + 1),
            }))}
            onOpen={() => {}}
            onClose={() => {}}
            //InputAccessoryView={() => null}
            style={pickerStyles}
            useNativeAndroidPickerStyle={false}
          />
        </Block>

        {/* Fav button */}

        <Button
          color='#fff'
          onPress={handleToggleFavState}
          onlyIcon
          icon={isFavourite ? 'heart' : 'hearto'}
          iconFamily='antdesign'
          iconSize={22}
          iconColor={favButtonColor}
          shadowless
          style={styles.favButton}
        />
      </Block>
    </Block>
  );
};

CheckoutCard.propTypes = {
  productId: PropTypes.number,
};

const styles = StyleSheet.create({
  root: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    marginVertical: 0,
    backgroundColor: 'white',
  },
  productImage: {
    flex: 1,
    marginBottom: 8, //TODO: why not 16 if yes remove it and set bottom margin 16 to parent
    width: null, //width / 6
    height: null, //width / 6
    resizeMode: 'contain',
  },
  productInfoContainer: { paddingHorizontal: 8, marginBottom: 16 },
  productTitle: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '400',
    color: 'rgb(34,34,34)',
  },
  price: { marginBottom: 8, fontWeight: '700', color: 'rgb(34,34,34)' },
  salePriceContainer: {
    fontWeight: '400',
  },
  salePrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  removeButton: {
    width: (width - 72) / 3,
    height: 16 * 2.75,

    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgb(216,217,218)',
  },

  favButton: {
    width: (width - 72) / 3,
    height: 16 * 2.75,

    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgb(227,94,23)',
  },

  quantityButton: {
    width: (width - 72) / 3,
    height: 16 * 2.75,

    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgb(216,217,218)',

    paddingHorizontal: 8,
  },
});

const pickerStyles = StyleSheet.create({
  viewContainer: { flex: 1 },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    textAlign: 'right',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default CheckoutCard;
