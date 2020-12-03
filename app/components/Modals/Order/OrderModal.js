import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

//Redux related imports
import { useSelector } from 'react-redux';

//Custom components
import OrderTitleView from './OrderTitleView';
import OrderInformationTitleView from './OrderInformationTitleView';
import OrderInformationDescriptionView from './OrderInformationDescriptionView';
import AddressView from './AddressView';
import GreenButton from '../../Buttons/GreenButton';
import DigitalWalletButton from '../../Buttons/DigitalWalletButton';

import useShipping from '../../../hooks/useShipping';

OrderModal.propTypes = {
  onCloseOrderScreen: PropTypes.func.isRequired,
  onPayWithCard: PropTypes.func.isRequired,
  onShowDigitalWallet: PropTypes.func.isRequired,
};

export default function OrderModal({
  onCloseOrderScreen,
  onPayWithCard,
  onShowDigitalWallet,
  onCashOnDelivery,
}) {
  const [isLoading, setIsloading] = React.useState(false);

  //Get shipping info from store
  const shippingAddress = useSelector((state) => state.user.details.shipping);

  //Get total product cost from store
  const totalProductCost = useSelector(
    (state) => state.lineItems.totalProductCost
  );

  //Get total tax from store
  const totalTax = useSelector((state) => state.lineItems.totalTax);

  //Get shipping cost from store
  const [shippingCost] = useShipping();

  const handleCashOnDelivery = async () => {
    try {
      setIsloading(true);
      await onCashOnDelivery();
      setIsloading(false);
    } catch (e) {
      setIsloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <OrderTitleView onCloseOrderScreen={() => onCloseOrderScreen()} />
      <View style={styles.bodyContent}>
        <View style={styles.row}>
          <View style={styles.titleColumn}>
            <OrderInformationTitleView title='Ship To' />
          </View>
          <View style={styles.descriptionColumn}>
            <OrderInformationDescriptionView
              description={`${shippingAddress.first_name} ${shippingAddress.last_name}`}
            />
            <AddressView
              address={`${shippingAddress.address_1},\n${
                shippingAddress.address_2
                  ? shippingAddress.address_2 + ',\n'
                  : ''
              }${shippingAddress.city},\n${shippingAddress.postcode}, ${
                shippingAddress.state
              }`}
            />
          </View>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.row}>
          <View style={styles.titleColumn}>
            <OrderInformationTitleView title='Total' />
          </View>
          <View style={styles.descriptionColumn}>
            <OrderInformationDescriptionView
              description={`$${Number(
                +shippingCost + +totalProductCost + +totalTax
              ).toFixed(2)}`}
            />
          </View>
        </View>
        <View style={styles.horizontalLine} />
        <Text style={styles.refundText}></Text>
      </View>
      <View style={styles.buttonRow}>
        <GreenButton
          onPress={handleCashOnDelivery}
          loading={isLoading}
          text='Cash on delivery'
        />
        <GreenButton onPress={onPayWithCard} text='Pay with card' />
        <DigitalWalletButton onPress={() => onShowDigitalWallet()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyContent: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '3%',
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '5%',
    width: '100%',
  },
  descriptionColumn: {
    flex: 2,
    flexDirection: 'column',
  },
  horizontalLine: {
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    marginBottom: '3%',
    marginTop: '3%',
  },
  refundText: {
    color: '#7B7B7B',
    fontSize: 12,
    marginBottom: '3%',
  },
  row: {
    flexDirection: 'row',
    width: '80%',
  },
  titleColumn: {
    flex: 1,
    flexDirection: 'column',
  },
});
