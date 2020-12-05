import React from 'react';
import { StyleSheet } from 'react-native';

//Galio imports
import { Block } from 'galio-framework';

//Custom components
import InfoText from '../../components/InfoText.js';
import Text from '../../components/Text.js';

//Other imports
import PropTypes from 'prop-types';
import _ from 'lodash';
import Button from '../../components/Buttons/Button';

const PaymentSummaryView = ({
  totalProductCost,
  totalTax,
  shippingCost,
  shippingMsg,
  shippingMsgType,
  postcode,
  onPostcodePress,
  onCheckoutPress,
}) => {
  return (
    <Block style={styles.paymentSummaryContainer}>
      {/* Shipping cost info */}
      {!!shippingMsg && (
        <InfoText
          severity={shippingMsgType}
          style={styles.shippinInfoContainer}
        >
          {shippingMsg}
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
              !!!postcode && {
                textTransform: null,
                fontSize: 13,
              },
            ]}
            onPress={onPostcodePress}
          >
            {postcode ? postcode : 'Please enter post code to see the pricing'}
          </Text>
        </Text>
        {typeof shippingCost == 'number' && (
          <Text>{shippingCost === 0 ? 'Free' : `${'$' + shippingCost}`}</Text>
        )}
      </Block>

      {/* Bag total */}
      <Block row space='between' style={styles.paymentSummaryTextContainer}>
        <Text bold>{'Bag subtotal'}</Text>

        <Text>{`$${Number(+shippingCost + totalProductCost + totalTax).toFixed(
          2
        )}`}</Text>
      </Block>

      {/* Checkout button */}
      <Button
        shadowless
        color={'white'}
        textStyle={styles.checkoutButtonText}
        style={styles.checkoutButtonContainer}
        onPress={onCheckoutPress}
      >
        Checkout
      </Button>
    </Block>
  );
};

PaymentSummaryView.defaultProps = {
  postcode: '',
  shippingMsg: '',
};

PaymentSummaryView.propTypes = {
  totalProductCost: PropTypes.number,
  totalTax: PropTypes.number,
  //shippingCost: PropTypes.number,
  shippingMsg: PropTypes.string,
  shippingMsgType: PropTypes.oneOf(['success', 'info', 'warning', 'error', '']),
  postcode: PropTypes.string,
  onPostcodePress: PropTypes.func,
  onCheckoutPress: PropTypes.func,
};

const styles = StyleSheet.create({
  paymentSummaryContainer: {
    padding: 8,
    borderTopWidth: 0.5,
    borderColor: 'grey',
  },
  shippinInfoContainer: { margin: -4, marginBottom: 8 },
  paymentSummaryTextContainer: { marginBottom: 4 },
  postCodeText: {
    textDecorationLine: 'underline',
    color: 'rgb(0,92,168)',
    textTransform: 'uppercase',
  },
  checkoutButtonText: { color: 'black', fontWeight: '600' },
  checkoutButtonContainer: { borderWidth: 0.5, width: '100%', margin: 0 },
});

export default PaymentSummaryView;
