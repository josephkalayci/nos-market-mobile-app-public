import React from 'react';
import {
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';

//Galio imports
import { Block, theme } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as productActions from '../store/actions/products';
import { getTotalItemQuantityInCart } from '../store/selectors.js';

//Custom components
import CheckoutCard from '../components/Cards/CheckoutCard.js';
import Header from '../components/Header/Header.js';
import AddressForm from '../components/Modals/AddressForm.js';
import InfoText from '../components/InfoText.js';
import PostCode from '../components/Modals/PostCode.js';
import Loader from '../components/Loader.js';
import Text from '../components/Text.js';

//Custom hooks and helpers
import useShipping from '../hooks/useShipping.js';
import { addressSchema } from '../helpers/addressSchema.js';

//Assets
import emtyCartImage from '../assets/images/emtyCart.png';

//Other imports
import _ from 'lodash';
import ErrorView from '../components/ErrorView';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Buttons/Button';

const ShoppingCartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [lastUpdated, setLastUpdated] = React.useState('');
  //Get user to check address info
  const user = useSelector((state) => state.user.details);

  const lineItemsAllIds = useSelector((state) => state.lineItems.allIds);

  const totalItemQuantity = useSelector(getTotalItemQuantityInCart);
  const totalProductCost = useSelector(
    (state) => state.lineItems.totalProductCost
  );
  const totalTax = useSelector((state) => state.lineItems.totalTax);

  const [shippingCost, shippingInfo] = useShipping();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState({
    addressModal: false,
    postCodeModal: false,
  });

  //refresh every 30 min products in checkout
  useFocusEffect(() => {
    if (!error) {
      handleRefreshData();
    }
  });

  const handleRefreshData = () => {
    const shouldCallApi = () => {
      const TTL_MS = 1000 * 60 * 30;
      const isCashed = Date.now() - lastUpdated > TTL_MS ? false : true;
      return lastUpdated == '' || !isCashed || lineItemsAllIds.length == 0;
    };
    if (shouldCallApi()) {
      setIsLoading(true);
      dispatch(productActions.fetchProducts({ include: lineItemsAllIds }))
        .then((response) => {
          if (response.length != lineItemsAllIds.length) {
            //some of your items is not available any more and removed your cart
          }
          setError(false);
          setLastUpdated(Date.now());
          setIsLoading(false);
        })
        .catch((error) => {
          setError(true);
          setIsLoading(false);
        });
    }
  };

  //If there is no valid shipping address open address model
  //else navigate to checkout screen
  const handleCheckout = () => {
    addressSchema
      .isValid({
        ...user.shipping,
        email: user.email,
        phone: user.billing?.phone,
      })
      .then((validityState) => {
        console.log(validityState);
        if (validityState) {
          navigation.navigate('CheckoutScreen');
        } else {
          setModalVisible({ ...modalVisible, addressModal: true });
        }
      });
  };

  const handleModalDissmiss = (modalName) => {
    if (modalName === 'shipping') {
      setModalVisible({ ...modalVisible, addressModal: false });
    }
    if (modalName === 'postcode') {
      setModalVisible({ ...modalVisible, postCodeModal: false });
    }
  };

  const renderEmthyCart = () => {
    return (
      <Block flex style={{ backgroundColor: 'white' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Image
            source={emtyCartImage}
            style={{
              flex: 1,
              width: null,
              height: null,
              resizeMode: 'contain',
            }}
          />
        </ScrollView>
      </Block>
    );
  };
  const renderLoading = () => (
    <Block flex center>
      <Loader style={{ height: 100 }} />
    </Block>
  );

  const renderProducts = () => (
    <FlatList
      data={lineItemsAllIds}
      keyExtractor={(item) => String(item)}
      contentContainerStyle={[styles.listContainer, styles.shadow]}
      ItemSeparatorComponent={() => <Block style={styles.seperator} />}
      ListHeaderComponent={() => (
        <Block middle right style={styles.banner}>
          <Text>{`${totalItemQuantity} items`}</Text>
        </Block>
      )}
      renderItem={({ item }) => (
        //TODO: fix here
        <CheckoutCard productId={item} />
      )}
    />
  );

  const renderPaymentSummary = () => {
    return (
      <Block style={styles.paymentSummaryContainer}>
        {/* Shipping cost info */}
        {shippingInfo.text !== '' && (
          <InfoText severity={shippingInfo.type} style={styles.paymentInfo}>
            {shippingInfo.text}
          </InfoText>
        )}

        {/* Total product cost without tax */}
        <Block row space='between' style={styles.paymentSummaryTextContainer}>
          <Text>{'Product Total'}</Text>
          <Text>{`$${totalProductCost}`}</Text>
        </Block>
        {/* Total tax */}
        <Block row space='between' style={styles.paymentSummaryTextContainer}>
          <Text>{'Estimated Tax'}</Text>
          <Text>{`$${totalTax}`}</Text>
        </Block>
        {/* Shipping cost */}
        <Block row space='between' style={styles.paymentSummaryTextContainer}>
          <Text>
            {'Shipping for '}
            <Text
              style={[
                styles.postCodeText,
                !user.shipping?.postcode && {
                  textTransform: null,
                  fontSize: 13,
                },
              ]}
              onPress={() =>
                setModalVisible({ ...modalVisible, postCodeModal: true })
              }
            >
              {user.shipping?.postcode
                ? user.shipping?.postcode
                : 'Please enter post code to see the pricing'}
            </Text>
          </Text>

          <Text>
            {shippingCost === 0
              ? 'Free'
              : `${shippingCost ? '$' + shippingCost : ''}`}
          </Text>
        </Block>

        {/* Bag total */}
        <Block row space='between' style={styles.paymentSummaryTextContainer}>
          <Text bold>{'Bag subtotal'}</Text>

          <Text>{`$${Number(shippingCost + totalProductCost + totalTax).toFixed(
            2
          )}`}</Text>
        </Block>

        {/* Checkout button */}
        <Button
          shadowless
          color={'white'}
          textStyle={styles.checkoutButtonText}
          style={styles.checkoutButtonContainer}
          disabled={isLoading}
          onPress={handleCheckout}
        >
          Checkout
        </Button>
      </Block>
    );
  };

  if (error) {
    return (
      <ErrorView
        onErrorFallback={() => handleRefreshData()}
        isLoading={isLoading}
      />
    );
  }

  if (!lineItemsAllIds.length) {
    return renderEmthyCart();
  }

  return (
    <Block flex>
      <Header title='Shopping Cart' navigation={navigation} />

      {isLoading ? (
        renderLoading()
      ) : (
        <React.Fragment>
          {renderProducts()}
          {renderPaymentSummary()}
        </React.Fragment>
      )}

      {/* Address modal */}
      <Modal
        animationType='slide'
        visible={modalVisible.addressModal}
        onRequestClose={() => handleModalDissmiss('shipping')}
      >
        <AddressForm
          title='Shipping Info'
          addressType='shipping'
          onSubmitSuccess={() => navigation.navigate('CheckoutScreen')}
          onDismiss={() => handleModalDissmiss('shipping')}
        />
      </Modal>

      {/* Postcode modal */}
      <Modal
        animationType='slide'
        visible={modalVisible.postCodeModal}
        onRequestClose={() => {
          handleModalDissmiss('postcode');
        }}
      >
        <PostCode onDismiss={() => handleModalDissmiss('postcode')} />
      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  paymentSummaryContainer: {
    padding: 8,
    borderTopWidth: 0.5,
    borderColor: 'grey',
  },
  paymentInfo: { margin: -4, marginBottom: 8 },
  paymentSummaryTextContainer: { marginBottom: 4 },
  postCodeText: {
    textDecorationLine: 'underline',
    color: 'rgb(0,92,168)',
    textTransform: 'uppercase',
  },
  checkoutButtonText: { color: 'black', fontWeight: '600' },
  checkoutButtonContainer: { borderWidth: 0.5, width: '100%', margin: 0 },
  banner: {
    height: 16 * 2.75,
    backgroundColor: 'rgb(237,247,248)',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(221, 221, 221)',
  },
  listContainer: {
    backgroundColor: '#fff',
  },
  seperator: {
    marginLeft: 24,
    borderWidth: 0.5,
    borderColor: 'rgb(221, 221, 221)',
  },
  shadow: {
    shadowColor: theme.COLORS.BLOCK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: theme.SIZES.BLOCK_SHADOW_OPACITY,
    shadowRadius: theme.SIZES.BLOCK_SHADOW_RADIUS,
    elevation: theme.SIZES.ANDROID_ELEVATION,
  },
});

export default ShoppingCartScreen;
