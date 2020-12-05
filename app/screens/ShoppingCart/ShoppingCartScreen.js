import React from 'react';
import { FlatList, StyleSheet, Modal } from 'react-native';

//Galio imports
import { Block, theme } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as productActions from '../../store/actions/products';
import { getTotalItemQuantityInCart } from '../../store/selectors.js';

//Custom components
import CheckoutCard from '../../components/Cards/CheckoutCard.js';
import Header from '../../components/Header/Header.js';
import AddressForm from '../../components/Modals/AddressForm.js';
import PostCode from '../../components/Modals/PostCode.js';
import Loader from '../../components/Loader.js';
import Text from '../../components/Text.js';

//Custom hooks and helpers
import useShipping from '../../hooks/useShipping.js';
import { addressSchema } from '../../helpers/addressSchema.js';

//Other imports
import _ from 'lodash';
import ErrorView from '../../components/ErrorView';
import { useFocusEffect } from '@react-navigation/native';
import EmptyCartView from './EmptyCartView';
import PaymentSummaryView from './PaymentSummaryView';

const ShoppingCartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [shippingCost, shippingInfo] = useShipping();

  const [lastUpdated, setLastUpdated] = React.useState('');

  //Get user to check address info
  const user = useSelector((state) => state.user.details);

  const lineItemsAllIds = useSelector((state) => state.lineItems.allIds);

  const totalItemQuantity = useSelector(getTotalItemQuantityInCart);
  const totalProductCost = useSelector(
    (state) => state.lineItems.totalProductCost
  );
  const totalTax = useSelector((state) => state.lineItems.totalTax);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isAddressModalVisible, setAddressModalVisible] = React.useState(false);
  const [isPostCodeModalVisible, setPostCodeModalVisible] = React.useState(
    false
  );

  //if screen loses focus more than 30 min refresh data
  useFocusEffect(() => {
    const shouldCallApi = () => {
      const TTL_MS = 1000 * 60 * 30;
      const isCashed = Date.now() - lastUpdated > TTL_MS ? false : true;
      return lastUpdated == '' || !isCashed || lineItemsAllIds.length == 0;
    };
    if (shouldCallApi() && !error && lineItemsAllIds.length) {
      handleRefreshData();
    }
  });

  const handleRefreshData = () => {
    setIsLoading(true);
    dispatch(productActions.fetchProducts({ include: lineItemsAllIds }))
      .then((response) => {
        if (response.length != lineItemsAllIds.length) {
          //some of your items is not available any more and removed your cart
        }
        setLastUpdated(Date.now());

        setError(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(true);
        setIsLoading(false);
      });
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
        if (validityState) {
          navigation.navigate('CheckoutScreen');
        } else {
          setAddressModalVisible(true);
        }
      });
  };

  //Render error view if there is an error
  if (error) {
    return (
      <ErrorView onErrorFallback={handleRefreshData} isLoading={isLoading} />
    );
  }

  //Render emty view if there is no item in cart
  if (!lineItemsAllIds.length) {
    return <EmptyCartView />;
  }

  //Render loading screen when fetching data
  if (isLoading) {
    return <Loader style={styles.loading} />;
  }

  return (
    <Block flex safe>
      {/* Checkout products */}
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
        renderItem={({ item }) => <CheckoutCard productId={item} />}
      />

      {/* Payment Summary */}
      <PaymentSummaryView
        totalProductCost={totalProductCost}
        totalTax={totalTax}
        shippingCost={shippingCost}
        shippingMsg={shippingInfo.text}
        shippingMsgType={shippingInfo.type}
        shippingInfo={shippingInfo}
        postcode={user.shipping?.postcode}
        onPostcodePress={() => setPostCodeModalVisible(true)}
        onCheckoutPress={handleCheckout}
      />

      {/* Address modal */}
      <Modal
        animationType='slide'
        visible={isAddressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <AddressForm
          title='Shipping Info'
          addressType='shipping'
          onSubmitSuccess={() => navigation.navigate('CheckoutScreen')}
          onDismiss={() => setAddressModalVisible(false)}
        />
      </Modal>

      {/* Postcode modal */}
      <Modal
        animationType='slide'
        visible={isPostCodeModalVisible}
        onRequestClose={() => setPostCodeModalVisible(false)}
      >
        <PostCode onDismiss={() => setPostCodeModalVisible(false)} />
      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  loading: { alignItems: 'center', alignSelf: 'center', height: 100 },
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
