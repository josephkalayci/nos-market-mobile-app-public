import axios from '../api/axios';

export default async function createOrder({ nonce, amount, orderData, token }) {
  try {
    let config = { ...orderData };
    if (orderData.payment_method !== 'cod') {
      config.amount = amount;
      config.nonce = nonce;
    }

    await axios.post(
      'orders',
      {
        ...config,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
