import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const postalCodeRegExp = /([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i;

export const addressSchema = yup.object().shape({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required'),
  address_1: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('Province is required'),
  postcode: yup
    .string()
    .matches(postalCodeRegExp, 'Postal Code is not valid')
    .required('Postal Code is required'),
  email: yup.string().email('Email is not valid').required('Email is required'),
  phone: yup
    .string()
    .matches(phoneRegExp, 'Mobile Phone number is not valid')
    .required('Mobile Phone Number is required'),
});
