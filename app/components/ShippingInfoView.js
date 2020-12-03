import * as React from 'react';
import { useSelector } from 'react-redux';
import InfoText from './InfoText';

//TODO:fix wrong calculation
export default function useShipping(totalProductCostWithTax) {
  const methods = useSelector((state) => state.shipping.methods);
  const postcode = useSelector(
    (state) => state.user.details?.shipping?.postcode
  );
  const totalProductCost = useSelector(
    (state) => state.lineItems.totalProductCost
  );
  const totalTax = useSelector((state) => state.lineItems.totalTax);
  const [shippingCost, setShippingCost] = React.useState('');
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => {
    const freeShipping = methods.find((el) => el.method_id === 'free_shipping'),
   
    const flatRate = methods.find((el) => el.method_id === 'flat_rate'),


    if (!methods.length) {
      setMsg({
        type: 'error',
        text:
          'Currently we are not available in your area or you entered incorrect postal code',
      });
      return;
    }

    if (freeShipping.method_id && totalProductCost + totalTax >= freeShipping.min_amount) {
      setMsg({
        type: 'success',
        text: `You are eligible for free shipping`,
      });
      return;
    } else if (
      freeShipping.method_id  &&
      totalProductCost + totalTax < freeShipping.minAmount
    ) {
      setMsg({
        type: 'warning',
        text: `Free shipping available for mininum Order ${freeShipping.min_amount}$`,
      });
    }

    if (flatRate.method_id  && !freeShipping.method_id ) {
      setMsg({
        type: 'info',
        text: `Your area has ${flatRate}$ flat shipping rate`,
      });
      return;
    }
    setMsg('');
  }, [totalProductCostWithTax, methods, postcode]);

  return (
    <Block>
      {msg != '' && (
        <InfoText severity={shippingMsg.type} style={{ marginHorizontal: -4 }}>
          {shippingMsg.text}
        </InfoText>
      )}
    </Block>
  );
}
