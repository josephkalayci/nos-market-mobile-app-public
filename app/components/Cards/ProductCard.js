import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

//Galio imports
import { Block, theme } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../../store/actions/lineItems';
import * as favListActions from '../../store/actions/favList';

//Custom components
import Text from '../Text';

//Other imports
import PropTypes from 'prop-types';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useNavigation } from '@react-navigation/native';
import Button from '../Buttons/Button';

const { width } = Dimensions.get('screen');

const favButtonColor = 'rgb(237,102,97)';
const cartButtonColor = 'rgb(237,102,97)';

const ProductCard = ({
  product,
  style,
  noShadow,
  showFavButton,
  showCartButton,
  onPress,
  ...rest
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  //Check if product is in favurite list
  const isFavourite = useSelector((state) => state.favList.byId[product.id]);

  //Set out of stock true if it is not available or it is out of stock
  const [isOutOfStock, setIsOutOfStock] = React.useState(
    product.status !== 'publish' || product.stock_status !== 'instock'
  );

  //Loading state for add to cart button
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  //Loading state for fav button
  const [isFavLoading, setIsFavLoading] = React.useState(false);

  //Fav button handler
  const handleToggleFavState = () => {
    if (isFavourite) {
      setIsFavLoading(true);

      setTimeout(() => {
        setIsFavLoading(false);
        dispatch(favListActions.removeFromFavList(product.id));
      }, 500);
    } else {
      setIsFavLoading(true);
      dispatch(favListActions.addToFavList(product.id));
      setTimeout(() => {
        setIsFavLoading(false);
      }, 1500);
    }
    ReactNativeHapticFeedback.trigger('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  //Add to cart button handler
  const handleAddToCart = () => {
    dispatch(actionTypes.addToCart(product.id));
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 2000);
    ReactNativeHapticFeedback.trigger('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  //Handle card onPress - navigate to the product screen
  const handleOnPress = () => {
    onPress();
    //navigation.navigate('Product', { productId: product?.id });
  };

  //Render null if there is no item
  if (Object.keys(product).length === 0) {
    return null;
  }

  const rootStyles = [styles.root, !noShadow && styles.shadow, style];

  return (
    <Block card style={rootStyles} {...rest}>
      <TouchableWithoutFeedback onPress={handleOnPress}>
        <Block>
          {/* Cart image */}
          <Block style={styles.imageContainer}>
            <Image
              source={{ uri: product?.images[0]?.src }}
              style={styles.image}
            />
            {/* Fav button */}
            {showFavButton && (
              <Button
                color='#ffffff'
                onPress={handleToggleFavState}
                onlyIcon
                loading={isFavLoading}
                icon={isFavourite ? 'heart' : 'hearto'}
                iconFamily='antdesign'
                iconSize={14}
                iconColor={favButtonColor}
                loadingColor={favButtonColor}
                style={styles.favButton}
              />
            )}

            {/* show out of stock info if there is no stock or if the product is not available */}
            {isOutOfStock && (
              <React.Fragment>
                <Block style={styles.overlay} />
                <Block
                  middle
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <Block
                    shadow
                    style={{
                      backgroundColor: 'rgb(202,202,204)',
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Text color={'#282828'} size={12}>
                      {'Out of stock'}
                    </Text>
                  </Block>
                </Block>
              </React.Fragment>
            )}
          </Block>

          {/* Product data */}
          <Block space='between' style={styles.productDescription}>
            <Text size={12} style={styles.productTitle} numberOfLines={2}>
              {product.name}
            </Text>

            {product.on_sale ? (
              <Block flex center row style={styles.priceContainer}>
                <Text
                  size={12}
                  muted
                  style={{
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    marginRight: 4,
                  }}
                >
                  {`$${product.regular_price}`}
                </Text>
                <Text size={14} style={{ fontWeight: '600' }}>
                  {`$${product.price}`}
                </Text>
              </Block>
            ) : (
              <Block flex center row style={styles.priceContainer}>
                <Text size={12} style={{ fontWeight: '600' }}>
                  {`$${product.price}`}
                </Text>
              </Block>
            )}
          </Block>
        </Block>
      </TouchableWithoutFeedback>

      {/* Add to cart button */}
      {showCartButton && !isOutOfStock && (
        <Block
          middle
          style={{
            paddingHorizontal: 8,
          }}
        >
          <Button
            color='#fff'
            onPress={handleAddToCart}
            loading={isAddingToCart}
            onlyIcon
            icon={'shoppingcart'}
            iconFamily='antdesign'
            iconSize={22}
            iconColor={cartButtonColor}
            loadingColor={cartButtonColor}
            disabled={isOutOfStock}
            shadowless
            style={styles.cartButton}
          />
        </Block>
      )}
    </Block>
  );
};

ProductCard.defaultProps = {
  styles: {},
  showFavButton: true,
  showCartButton: true,
  noShadow: false,
};

ProductCard.propTypes = {
  product: PropTypes.object,
  showFavButton: PropTypes.bool,
  showCartButton: PropTypes.bool,
  noShadow: PropTypes.bool,
  styles: PropTypes.any,
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.COLORS.WHITE,
    margin: theme.SIZES.BASE / 4,
    marginVertical: theme.SIZES.BASE / 4,
    borderWidth: 0,
    width: (width - 40) / 3, //28
  },
  imageContainer: {
    padding: theme.SIZES.BASE / 2,
  },
  image: {
    marginHorizontal: theme.SIZES.BASE / 2,
    height: width / 5,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgb(243,243,243)',
    opacity: 0.6,
  },
  productDescription: {
    paddingHorizontal: theme.SIZES.BASE / 2,
  },
  productTitle: {},
  priceContainer: {
    marginVertical: theme.SIZES.BASE / 4,
    marginBottom: 2,
  },

  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cartButton: {
    margin: 8,
    width: '100%',
    height: 12 * 2.75,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: cartButtonColor,
  },

  favButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ProductCard;
