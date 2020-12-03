import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShippingRate } from '../store/actions/shipping';

export default function useShipping() {
  const dispatch = useDispatch();
  const totalProductCost = useSelector(
    (state) => state.lineItems.totalProductCost
  );
  const totalTax = useSelector((state) => state.lineItems.totalTax);
  const methods = useSelector((state) => state.shipping.methods);
  const lastUpdated = useSelector((state) => state.shipping.lastUpdated);
  const postcode = useSelector(
    (state) => state.user.details?.shipping?.postcode
  );
  const [msg, setMsg] = React.useState({ type: '', text: '' });
  const [shippingCost, setShippingCost] = React.useState(false);

  React.useEffect(() => {
    const freeShipping = methods.find((el) => el.method_id === 'free_shipping');
    const flatRate = methods.find((el) => el.method_id === 'flat_rate');

    if (!postcode) {
      setMsg({ type: '', text: '' });
      setShippingCost(false);
      return;
    }

    if (postcode && lastUpdated == '') {
      setMsg({ type: '', text: '' });
      setShippingCost(false);
      dispatch(fetchShippingRate(postcode));
      return;
    }

    if (!freeShipping.method_id && !flatRate.method_id && lastUpdated != '') {
      setMsg({
        type: 'error',
        text:
          'Currently we are not available in your area or you entered incorrect postal code',
      });
      setShippingCost(false);
      return;
    }

    if (
      freeShipping.enabled &&
      totalProductCost + totalTax >= freeShipping.min_amount
    ) {
      setMsg({
        type: 'success',
        text: `You are eligible for free shipping`,
      });
      setShippingCost(0);
      return;
    } else if (
      freeShipping.enabled &&
      flatRate.enabled &&
      totalProductCost + totalTax < freeShipping.min_amount
    ) {
      setMsg({
        type: 'warning',
        text: `Free shipping available for mininum Order ${freeShipping.min_amount}$`,
      });
      setShippingCost(flatRate.cost);
      return;
    }

    if (flatRate.enabled && !freeShipping.enabled) {
      setMsg({
        type: 'info',
        text: `Your area has ${flatRate.cost}$ flat shipping rate`,
      });
      setShippingCost(flatRate.cost);
      return;
    }
    setMsg({ type: '', text: '' });
  }, [totalProductCost, totalTax, postcode, methods]);

  return [shippingCost, msg];
}
