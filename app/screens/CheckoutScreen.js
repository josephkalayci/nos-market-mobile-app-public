import React from 'react';
import { StyleSheet, Image, ScrollView, Modal } from 'react-native';

//Galio imports
import { Block, Input } from 'galio-framework';

//Redux related imports
import * as userActions from '../store/actions/user';
import { useSelector, useDispatch } from 'react-redux';

//Custom components
import Header from '../components/Header/Header.js';
import AddressForm from '../components/Modals/AddressForm.js';
import CheckBox from '../components/Inputs/CheckBox.js';
import InfoText from '../components/InfoText.js';
import BuyButton from '../components/Buttons/BuyButton';
import Text from '../components/Text.js';

//Custom helpers
import { addressSchema } from '../helpers/addressSchema.js';

//Custom hooks
import useShipping from '../hooks/useShipping.js';
import Button from '../components/Buttons/Button';

const visaLogo = require('../assets/images/visaLogo.png');
const masterCardLogo = require('../assets/images/masterCardLogo.png');
const discoverLogo = require('../assets/images/discoverLogo.png');
const applePayLogo = require('../assets/images/applePayLogoBlack.png');

const CheckoutScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  //Total product cost without tax
  const totalProductCost = useSelector(
    (state) => state.lineItems.totalProductCost
  );

  //Total tax Note:Calculated with redux middleware on each time
  //when there is an update on inventory or lineItems
  const totalTax = useSelector((state) => state.lineItems.totalTax);

  //Shipping cost Note: calculated each time
  //when there is an update on totalProductCost and post code
  const [shippingCost, shippingMsg] = useShipping();

  //Shipping address
  const shippingAddress = useSelector((state) => state.user.details.shipping);

  //Billing address
  const billingAddress = useSelector((state) => state.user.details.billing);

  //Check if billing address same as shipping default: true
  const billingSameAsShipping = useSelector(
    (state) => state.user.billingSameAsShipping
  );

  //Controls visibility of shipping and billing modals
  const [modalVisible, setModalVisible] = React.useState({
    shipping: false,
    billing: false,
  });

  const [coupon, setCoupon] = React.useState({
    code: '',
    isLoading: false,
    message: '',
  });

  //TODO:implement handleCoupon function
  const handleCoupon = () => {};

  const renderAddressInfo = (address, addressType) => {
    //Check if address is valid
    const isAddressValid = addressSchema.isValidSync(address);

    return (
      <Block style={styles.addressContainer}>
        <Text style={styles.title}>{`${addressType} Info`}</Text>
        {addressType === 'billing' && (
          <CheckBox
            value={billingSameAsShipping}
            style={styles.checkbox}
            color='#000'
            label='Same with shipping info'
            onChange={(val) => {
              dispatch(userActions.setBillingSameAsShipping(val));
              if (!val && !isAddressValid) {
                setModalVisible({ ...modalVisible, billing: true });
              }
            }}
          />
        )}

        {isAddressValid &&
        (addressType === 'billing' ? !billingSameAsShipping : true) ? (
          <Block style={styles.addresInfoContainer}>
            {/* Name and surname */}
            <Button
              icon='edit'
              iconFamily='antdesign'
              color='transparent'
              iconColor='#000'
              iconSize={18}
              shadowless
              iconRight
              style={styles.addressEditButton}
              textStyle={styles.userName}
              onPress={() =>
                setModalVisible({ ...modalVisible, [addressType]: true })
              }
            >
              {`${address.first_name} ${address.last_name}  `}
            </Button>

            {/* Address info */}
            <Text style={styles.address}>{`${address.address_1} ${
              address.address_2 ? ' ' + address.address_2 + ', ' : ','
            } ${address.city}, ${address.postcode}, ${address.state}`}</Text>
            {/* Phone Number */}
            <Text style={styles.contactInfo}>{`${address.phone}`}</Text>
            {/* Email info */}
            <Text style={styles.contactInfo}>{`${address.email}`}</Text>
          </Block>
        ) : null}
      </Block>
    );
  };
  const renderPaymentSummary = () => (
    <Block style={styles.orderContainer}>
      <Text style={styles.title}>{'Order Summary'}</Text>
      <Text>{`Cost based on ${shippingAddress?.postcode.toUpperCase()}`}</Text>

      <Block style={styles.divider} />
      {/* Product cost without tax */}
      <Block row space='between' style={{ marginBottom: 8 }}>
        <Text>{'Product Total'}</Text>
        <Text>{`$${totalProductCost}`}</Text>
      </Block>
      {/* Total tax */}
      <Block row space='between' style={{ marginBottom: 8 }}>
        <Text>{'Estimated Tax'}</Text>
        <Text>{`$${totalTax}`}</Text>
      </Block>
      {/* Shipping cost */}
      <Block row space='between' style={{ marginBottom: 8 }}>
        <Text>{'Delivery'}</Text>
        <Text>{shippingCost === 0 ? `Free` : `$${shippingCost}`}</Text>
      </Block>
      {/* Bag total */}
      <Block row space='between' style={{ marginBottom: 8 }}>
        <Text bold>{'Bag subtotal'}</Text>
        <Text bold>{`$${Number(
          +shippingCost + +totalProductCost + +totalTax
        ).toFixed(2)}`}</Text>
      </Block>

      {/* Information about shipping cost */}
      {shippingMsg.text != '' && (
        <InfoText severity={shippingMsg.type} style={{ marginHorizontal: -4 }}>
          {shippingMsg.text}
        </InfoText>
      )}
    </Block>
  );

  // Available payment options
  const renderPaymentOptions = () => (
    <Block shadow style={styles.paymentContainer}>
      <Text style={styles.title}>Payment</Text>
      <Text>Available methods</Text>
      <Block style={styles.divider} />

      <Block row>
        <Image source={applePayLogo} style={styles.paymentMethodLogoApple} />
        <Image source={visaLogo} style={styles.paymentMethodLogo} />
        <Image source={masterCardLogo} style={styles.paymentMethodLogo} />
        <Image source={discoverLogo} style={styles.paymentMethodLogo} />
        <Block center middle style={styles.paymentMethodLogo}>
          <Text bold size={9}>
            {'Pay at\nthe Door'}
          </Text>
        </Block>
      </Block>
    </Block>
  );

  const renderCouponCode = () => (
    <Block style={styles.couponContainer}>
      <Block row space='between' middle>
        <Input
          placeholder={'Coupon code'}
          style={styles.couponInput}
          onChangeText={(text) => setCoupon({ ...coupon, code: text })}
        />
        <Button
          loading={coupon.isLoading}
          disabled={coupon.isLoading}
          color='black'
          shadowless
          size='small'
          style={{ margin: 0, marginLeft: 8 }}
          onPress={() => handleCoupon(coupon.code)}
        >
          Apply
        </Button>
      </Block>
      {/* Coupon helper text */}
      {coupon.message ? (
        <Text size={12} muted>
          {coupon.message}
        </Text>
      ) : null}
    </Block>
  );

  return (
    <Block flex>
      <Header title='Checkout' modal back navigation={navigation} />
      <ScrollView>
        <Block style={{ paddingTop: 16 }}>
          {/* Shipping address section */}
          {renderAddressInfo(shippingAddress, 'shipping')}

          {/* Billing address section */}
          {renderAddressInfo(billingAddress, 'billing')}

          {/* Coupon code */}
          {renderCouponCode()}

          {/* Payment summary */}
          {renderPaymentSummary()}

          {/* Available payment options */}
          {renderPaymentOptions()}

          {/* Buy button starts payment process */}
          <BuyButton />

          {/* Shipping address modal */}
          <Modal
            animationType='slide'
            visible={modalVisible.shipping}
            onRequestClose={() => {
              setModalVisible({ ...modalVisible, shipping: false });
            }}
          >
            <AddressForm
              title='Shipping Info'
              addressType='shipping'
              onSubmitSuccess={() =>
                setModalVisible({ ...modalVisible, shipping: false })
              }
              onDismiss={() =>
                setModalVisible({ ...modalVisible, shipping: false })
              }
            />
          </Modal>

          {/* Billing address modal */}
          <Modal
            animationType='slide'
            visible={modalVisible.billing}
            onRequestClose={() => {
              const isBillingAddressValid = addressSchema.isValidSync(
                billingAddress
              );
              if (!isBillingAddressValid && !billingSameAsShipping) {
                dispatch(userActions.setBillingSameAsShipping(true));
              }

              setModalVisible({ ...modalVisible, billing: false });
            }}
          >
            <AddressForm
              title='Billing Info'
              addressType='billing'
              onSubmitSuccess={() =>
                setModalVisible({ ...modalVisible, billing: false })
              }
              onDismiss={() => {
                const isBillingAddressValid = addressSchema.isValidSync(
                  billingAddress
                );
                if (!isBillingAddressValid && !billingSameAsShipping) {
                  dispatch(userActions.setBillingSameAsShipping(true));
                }

                setModalVisible({ ...modalVisible, billing: false });
              }}
            />
          </Modal>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  addressContainer: { margin: 8, marginTop: 8 },
  title: {
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    color: 'rgb(34,34,34)',
  },
  addressEditButton: {
    alignItems: 'baseline',
    width: 'auto',
    margin: 0,
  },
  userName: {
    marginBottom: 4,
    fontWeight: '700',
    color: 'rgb(34,34,34)',
    textTransform: 'capitalize',
  },
  address: {
    fontWeight: '400',
    fontSize: 12,
    textTransform: 'capitalize',
    color: 'rgb(34,34,34)',
  },
  contactInfo: { fontSize: 12, color: 'rgb(34,34,34)', marginTop: 4 },
  checkbox: { marginTop: 8 },
  addresInfoContainer: {
    marginVertical: 8,
    padding: 8,
    borderColor: 'rgb(216,217,218)',
    borderWidth: 1,
    borderRadius: 2,
  },
  couponContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 16,
  },
  couponInput: {
    borderColor: 'rgb(216,217,218)',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  orderContainer: {
    margin: 8,
    padding: 8,
    backgroundColor: 'rgb(241,240,239)',
    borderRadius: 4,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    width: '100%',
    marginVertical: 16,
  },
  paymentContainer: {
    margin: 8,
    padding: 8,
    backgroundColor: 'rgb(241,240,239)',
    borderRadius: 4,
  },
  paymentMethodLogoApple: {
    width: 60,
    height: 40,
    resizeMode: 'stretch',
    backgroundColor: 'rgb(241,240,239)',
    marginRight: 10,
  },
  paymentMethodLogo: {
    width: 60,
    height: 40,
    resizeMode: 'stretch',
    backgroundColor: 'white',
    borderColor: 'rgb(216,217,218)',
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
  },
});

export default CheckoutScreen;
