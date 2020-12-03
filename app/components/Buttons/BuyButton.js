import React from 'react';
import { StyleSheet, View, Platform, Alert } from 'react-native';

//Redux related imports
import { useDispatch, useSelector } from 'react-redux';
import * as lineItemActions from '../../store/actions/lineItems';

//Square up imports
import {
  SQIPCardEntry,
  SQIPApplePay,
  SQIPCore,
  SQIPGooglePay,
} from 'react-native-square-in-app-payments';

//Square up constants
import {
  SQUARE_APP_ID,
  CHARGE_SERVER_HOST,
  GOOGLE_PAY_LOCATION_ID,
  APPLE_PAY_MERCHANT_ID,
} from '../../constants/Api';

//Services and utilities
import createOrder from '../../service/CreateOrder';

//Custom components
import OrderModal from '..//Modals/Order/OrderModal';
import useShipping from '../../hooks/useShipping';

//Other imports
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';

const applePayStatus = {
  none: 0,
  succeeded: 1,
  nonceNotCharged: 2,
};

const iOSCardEntryTheme = {
  saveButtonFont: {
    size: 30,
  },
  saveButtonTitle: 'Pay',
  keyboardAppearance: 'Light',

  tintColor: {
    r: 36,
    g: 152,
    b: 141,
    a: 0.9,
  },
  textColor: {
    r: 36,
    g: 152,
    b: 141,
    a: 0.9,
  },
};

const BuyButton = () => {
  const dispatch = useDispatch();
  //Get shipping info from store
  const user = useSelector((state) => state.user.details);
  const authToken = useSelector((state) => state.user.token);
  const lineItemsById = useSelector((state) => state.lineItems.byId);
  const billingSameAsShipping = useSelector(
    (state) => state.user.billingSameAsShipping
  );
  const totalProductCost = useSelector(
    (state) => state.lineItems.totalProductCost
  );
  const totalTax = useSelector((state) => state.lineItems.totalTax);
  const [shippingCost] = useShipping();

  const navigation = useNavigation();

  //Bottom sheed include pay buttons for credid cart, digital wallet and cash on delivery
  //when it is true->false checks showingCardEntry, showingDigitalWallet and starts payment process
  const [showingBottomSheet, setShowingBottomSheet] = React.useState(false);

  const [showingCardEntry, setShowingCardEntry] = React.useState(false);
  const [showingDigitalWallet, setShowingDigitalWallet] = React.useState(false);

  const [canUseDigitalWallet, setCanUseDigitalWallet] = React.useState(false);
  const [applePayState, setApplePayState] = React.useState(applePayStatus.none);
  const [applePayError, setApplePayError] = React.useState(null);

  React.useEffect(() => {
    async function initializePayment() {
      await SQIPCore.setSquareApplicationId(SQUARE_APP_ID);
      let digitalWalletEnabled = false;
      if (Platform.OS === 'ios') {
        try {
          await SQIPApplePay.initializeApplePay(APPLE_PAY_MERCHANT_ID);
          digitalWalletEnabled = await SQIPApplePay.canUseApplePay();
        } catch (ex) {
          console.log(ex);
        }
      } else if (Platform.OS === 'android') {
        await SQIPGooglePay.initializeGooglePay(
          GOOGLE_PAY_LOCATION_ID,
          SQIPGooglePay.EnvironmentTest
        );
        try {
          digitalWalletEnabled = await SQIPGooglePay.canUseGooglePay();
        } catch (ex) {
          console.log(ex);
        }
      }
      setCanUseDigitalWallet(digitalWalletEnabled);
    }

    initializePayment();
  }, []);

  //APPLE PAY HANDLERS
  const onApplePayRequestNonceSuccess = async (cardDetails) => {
    if (chargeServerHostIsSet()) {
      try {
        const totalAmount = Number(
          shippingCost + totalProductCost + totalTax
        ).toFixed(2);
        const order = {
          payment_method: 'square_apple_pay',
          payment_method_title: 'Apple Pay',
          shipping: user.shipping,
          billing: billingSameAsShipping ? user.shipping : user.billing,
          line_items: Object.values(lineItemsById),
          shipping_lines: [
            {
              method_id: shippingCost > 0 ? 'flat_rate' : 'free_shipping',
              method_title: shippingCost > 0 ? 'Flat Rate' : 'Free Shipping',
              total: String(shippingCost),
            },
          ],
        };
        await createOrder({
          nonce: cardDetails.nonce,
          amount: totalAmount,
          token: authToken,
          orderData: order,
        });

        await SQIPApplePay.completeApplePayAuthorization(true);
        setApplePayState(applePayStatus.succeeded);
        dispatch(lineItemActions.placeOrder());
        navigation.navigate('OrderScreen');
      } catch (error) {
        await SQIPApplePay.completeApplePayAuthorization(false, error.message);
        setApplePayError(error.message);
      }
    } else {
      await SQIPApplePay.completeApplePayAuthorization(true);
      setApplePayState(applePayStatus.nonceNotCharged);

      //printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
    }
  };

  const onApplePayRequestNonceFailure = async (errorInfo) => {
    await SQIPApplePay.completeApplePayAuthorization(false, errorInfo.message);
    Alert.alert('Error processing Apple Pay payment', errorInfo.message);
  };

  const onApplePayComplete = async () => {
    if (applePayState === applePayStatus.succeeded) {
      Alert.alert(
        'Your order was successful',
        'Go to your Square dashboard to see this order reflected in the sales tab.'
      );
    } else if (applePayState === applePayStatus.nonceNotCharged) {
      Alert.alert(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.'
      );
    } else if (applePayError != null) {
      Alert.alert('Error processing Apple Pay payment', applePayError);
    } else {
      // the state is none, so they canceled
      setShowingBottomSheet(true);
    }
  };

  //GOOGLE PAY HANDLERS
  const onGooglePayRequestNonceSuccess = async (cardDetails) => {
    if (chargeServerHostIsSet()) {
      try {
        const totalAmount = Number(
          shippingCost + totalProductCost + totalTax
        ).toFixed(2);
        const order = {
          payment_method: 'square_google_pay',
          payment_method_title: 'Google Pay',
          shipping: user.shipping,
          billing: billingSameAsShipping ? user.shipping : user.billing,
          line_items: Object.values(lineItemsById),
          shipping_lines: [
            {
              method_id: shippingCost > 0 ? 'flat_rate' : 'free_shipping',
              method_title: shippingCost > 0 ? 'Flat Rate' : 'Free Shipping',
              total: String(shippingCost),
            },
          ],
        };

        await createOrder({
          nonce: cardDetails.nonce,
          amount: totalAmount,
          orderData: order,
          token: authToken,
        });

        dispatch(lineItemActions.placeOrder());
        navigation.navigate('OrderScreen');
      } catch (error) {
        Alert.alert('Error processing GooglePay payment', error.message);
      }
    } else {
      //printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
      Alert.alert(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.'
      );
    }
  };

  const onGooglePayRequestNonceFailure = (errorInfo) => {
    Alert.alert('Could not complete GooglePay payment', errorInfo);
  };

  const onGooglePayCanceled = () => {
    setShowingBottomSheet(true);
  };

  //CREDIT CARD PAYMENT HANDLERS
  const onCardNonceRequestSuccess = async (cardDetails) => {
    const totalAmount = Number(
      shippingCost + totalProductCost + totalTax
    ).toFixed(2);
    const totalAmountInCent = Math.round(
      100 *
        parseFloat(
          typeof totalAmount === 'string'
            ? totalAmount.replace(/[$,]/g, '')
            : totalAmount
        )
    );
    if (chargeServerHostIsSet()) {
      try {
        const order = {
          payment_method: 'square_credit_card',
          payment_method_title: 'Credit Card',
          set_paid: false,
          shipping: user.shipping,
          billing: billingSameAsShipping ? user.shipping : user.billing,
          line_items: Object.values(lineItemsById),
          shipping_lines: [
            {
              method_id: shippingCost > 0 ? 'flat_rate' : 'free_shipping',
              method_title: shippingCost > 0 ? 'Flat Rate' : 'Free Shipping',
              total: String(shippingCost),
            },
          ],
        };

        await createOrder({
          nonce: cardDetails.nonce,
          amount: totalAmountInCent,
          orderData: order,
          token: authToken,
        });

        dispatch(lineItemActions.placeOrder());
        SQIPCardEntry.completeCardEntry(() => {
          navigation.navigate('OrderScreen');
        });
      } catch (error) {
        console.log(error);
        SQIPCardEntry.showCardNonceProcessingError(error.message);
      }
    } else {
      SQIPCardEntry.completeCardEntry(() => {
        //printCurlCommand(cardDetails.nonce, SQUARE_APP_ID);
        Alert.alert(
          'Nonce generated but not charged',
          'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.'
        );
      });
    }
  };

  //Starts credit card payment process
  const startCardEntry = async () => {
    console.log('STARTING card entry');

    const totalAmount = Number(
      +shippingCost + +totalProductCost + +totalTax
    ).toFixed(2);
    const totalAmountInCent = Math.round(
      100 *
        parseFloat(
          typeof totalAmount === 'string'
            ? totalAmount.replace(/[$,]/g, '')
            : totalAmount
        )
    );

    setShowingCardEntry(false);
    const cardEntryConfig = {
      collectPostalCode: true,
      buyerAction: 'Charge',
      amount: totalAmountInCent,
      currencyCode: 'CAD',
      givenName: user.shipping.last_name,
      familyName: user.shipping.first_name,
      addressLines: [user.shipping.address_1, user.shipping.address_2],
      city: user.shipping.city,
      countryCode: 'CA',
      email: user.shipping.email,
      phone: user.shipping.phone,
      postalCode: user.shipping.postcode,
    };
    if (Platform.OS === 'ios') {
      await SQIPCardEntry.setIOSCardEntryTheme({
        ...iOSCardEntryTheme,
        saveButtonTitle: 'Pay',
      });
    }
    await SQIPCardEntry.startCardEntryFlow(
      cardEntryConfig,
      onCardNonceRequestSuccess,
      onCardEntryCancel
    );
  };

  //Starts digital wallet payment process
  const startDigitalWallet = async () => {
    const totalAmount = Number(
      shippingCost + totalProductCost + totalTax
    ).toFixed(2);

    if (Platform.OS === 'ios' && canUseDigitalWallet) {
      if (!applePayMerchantIsSet()) {
        Alert.alert(
          'Missing Apple Merchant ID',
          'To request an Apple Pay nonce, replace APPLE_PAY_MERCHANT_ID' +
            ' in Constants.js with an Apple Merchant ID.'
        );
      } else {
        await SQIPApplePay.requestApplePayNonce(
          {
            price: totalAmount,
            summaryLabel: 'Nos Market',
            countryCode: 'CA',
            currencyCode: 'CAD',
            paymentType: SQIPApplePay.PaymentTypeFinal,
          },
          onApplePayRequestNonceSuccess,
          onApplePayRequestNonceFailure,
          onApplePayComplete
        );
      }
    } else if (Platform.OS === 'android') {
      if (!googlePayLocationIsSet()) {
        Alert.alert(
          'Missing GooglePay Location ID',
          'To request a GooglePay nonce, replace GOOGLE_PAY_LOCATION_ID' +
            ' in Constants.js with an Square Location ID.'
        );
      } else {
        await SQIPGooglePay.requestGooglePayNonce(
          {
            price: totalAmount,
            currencyCode: 'CAD',
            priceStatus: SQIPGooglePay.TotalPriceStatusFinal,
          },
          onGooglePayRequestNonceSuccess,
          onGooglePayRequestNonceFailure,
          onGooglePayCanceled
        );
      }
    }
  };

  //Checks constants and starts payment process
  const checkStateAndPerform = () => {
    if (showingCardEntry) {
      // if application id is not set, we will let you know where to set it,
      if (!applicationIdIsSet()) {
        Alert.alert(
          'Missing Square Application ID',
          'To request a nonce, replace SQUARE_APP_ID in Constants.js with an Square Application ID.'
        );
      } else {
        // call startCardEntry() to start Card Entry without buyer verification (SCA)
        startCardEntry();
      }
    } else if (showingDigitalWallet) {
      startDigitalWallet();
      setShowingDigitalWallet(false);
    }
  };

  const handleCashOnDeliveryOrder = async () => {
    try {
      const order = {
        payment_method: 'cod',
        payment_method_title: 'Cash on delivery',
        shipping: user.shipping,
        billing: billingSameAsShipping ? user.shipping : user.billing,
        line_items: Object.values(lineItemsById),
        shipping_lines: [
          {
            method_id: shippingCost > 0 ? 'flat_rate' : 'free_shipping',
            method_title: shippingCost > 0 ? 'Flat Rate' : 'Free Shipping',
            total: String(shippingCost),
          },
        ],
      };

      console.log(order);
      await createOrder({ orderData: order, token: authToken });
      setShowingBottomSheet(false);
      dispatch(lineItemActions.placeOrder());
      navigation.navigate('OrderScreen');
    } catch (e) {
      Alert.alert('Opps!', 'Something went wrong please try again.');
    }
  };

  const onCardEntryCancel = () => {
    setShowingBottomSheet(true);
  };

  //Check if payment constants are set
  const applicationIdIsSet = () => {
    return SQUARE_APP_ID !== 'REPLACE_ME';
  };

  const chargeServerHostIsSet = () => {
    return CHARGE_SERVER_HOST !== 'REPLACE_ME';
  };

  const googlePayLocationIsSet = () => {
    return GOOGLE_PAY_LOCATION_ID !== 'REPLACE_ME';
  };

  const applePayMerchantIsSet = () => {
    return APPLE_PAY_MERCHANT_ID !== 'REPLACE_ME';
  };

  return (
    <View style={styles.root}>
      <Button
        bold
        onPress={() => setShowingBottomSheet(true)}
        shadowless
        round
        textStyle={styles.buttonText}
        style={styles.button}
      >
        Continue with Payment
      </Button>

      <Modal
        isVisible={showingBottomSheet}
        style={styles.bottomModal}
        onBackdropPress={() => setShowingBottomSheet(false)}
        // set timeout due to iOS needing to make sure modal is closed
        // before presenting another view
        onModalHide={() => setTimeout(() => checkStateAndPerform(), 200)}
      >
        <View style={styles.modalContent}>
          <OrderModal
            onCloseOrderScreen={() => setShowingBottomSheet(false)}
            onCashOnDelivery={() => handleCashOnDeliveryOrder()}
            onPayWithCard={() => {
              setShowingBottomSheet(false);
              setShowingCardEntry(true);
            }}
            onShowDigitalWallet={() => {
              setShowingBottomSheet(false);
              setShowingDigitalWallet(true);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',

    justifyContent: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 0,
    flexShrink: 1,
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: 'rgb(76,175,80)',
    width: '90%',
  },
  buttonText: {
    // textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: '400',
  },
});

export default BuyButton;
