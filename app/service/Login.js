import axios from '../api/axios';

export default async function startLogin(email, password) {
  try {
    const authReponse = await axios.post(`auth`, {
      username: email,
      password: password,
    });

    const token = authReponse.data.token;
    const userId = authReponse.data.id;

    const userDetailsResponse = await axios.get(`users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      token: token,
      user: {
        ...userDetailsResponse.data,
        shipping: {
          ...userDetailsResponse.data.shipping,
          email: userDetailsResponse.data.email,
          phone: userDetailsResponse.data.billing.phone,
        },
      },
    };
  } catch (error) {
    if (error.response.data.name == 'auth_error') {
      throw {
        type: 'auth_error',
        message: error.response.data.message,
      };
    } else {
      throw error;
    }
  }
}
