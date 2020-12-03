# Example e-commerce mobile app for woocommerce

<img src="https://github.com/josephkalayci/nos-market-mobile-app-public/blob/master/image1.png" width="120" alt="app image 1"> <img src="https://github.com/josephkalayci/nos-market-mobile-app-public/blob/master/image2.png" width="120" alt="app image 2">
<img src="https://github.com/josephkalayci/nos-market-mobile-app-public/blob/master/image3.png" width="120" alt="app image 3">
<img src="https://github.com/josephkalayci/nos-market-mobile-app-public/blob/master/image4.png" width="120" alt="app image 4">

<img src="https://github.com/josephkalayci/nos-market-mobile-app-public/blob/master/image5.png" width="120" alt="app image 1"> <img src="https://github.com/josephkalayci/nos-market-mobile-app-public/blob/master/image6.png" width="120" alt="app image 2"> <img src="https://github.com/josephkalayci/nos-market-mobile-app-public/blob/master/image7.png" width="120" alt="app image 3">
<img src="https://github.com/josephkalayci/nos-market-mobile-app-public/blob/master/image8.png" width="120" alt="app image 4">

## Youtube preview

https://www.youtube.com/watch?v=GazZurS6sTE&feature=youtu.be

## Before using

- Please make sure to create Api.js in app/constans and do not forget to add following lines

```
const BASE_URL = 'https://some-url.herokuapp.com';

//SQUARE UP CONSTANTS
const SQUARE_APP_ID = 'your-square-id';
const SQUARE_LOCATION_ID = 'location-id';
const CHARGE_SERVER_HOST = BASE_URL;
const CHARGE_SERVER_URL = `${BASE_URL}/orders`;
const GOOGLE_PAY_LOCATION_ID = 'REPLACE_ME';
const APPLE_PAY_MERCHANT_ID = 'REPLACE_ME';

module.exports = {
SQUARE_APP_ID,
SQUARE_LOCATION_ID,
CHARGE_SERVER_HOST,
CHARGE_SERVER_URL,
GOOGLE_PAY_LOCATION_ID,
APPLE_PAY_MERCHANT_ID,
BASE_URL,
};
```
