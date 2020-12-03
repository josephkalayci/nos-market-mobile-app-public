import React from 'react';
import {
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

//Galio imports
import { Block, Icon } from 'galio-framework';

//Redux related imports
import { useDispatch, useSelector } from 'react-redux';
import {
  setBillingAddress,
  setShippingAddress,
} from '../../store/actions/user.js';

//Custom components
import Header from '../Header/Header.js';
import Text from '../Text.js';

//Helpers
import _ from 'lodash';

//Other imports
import { Formik } from 'formik';
import * as yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import PropTypes from 'prop-types';
import Button from '../Buttons/Button.js';

//Regex for validation
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const postalCodeRegExp = /([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i;

const AddressForm = ({ title, onDismiss, addressType, onSubmitSuccess }) => {
  const dispatch = useDispatch();

  //Get user info from store
  const user = useSelector((state) => state.user.details);
  const isAuth = useSelector((state) => state.user.isAuth);

  //Loading state
  const [isLoading, setIsLoading] = React.useState(false);

  //Inputs focus state
  const [isfocused, setIsfocused] = React.useState({
    name: 'itemName',
  });

  // Submit handler
  const handleAddressSubmit = (address) => {
    //Check if the address is the same with previous one
    if (_.isEqual(address, user[addressType])) {
      onSubmitSuccess();
      onDismiss();
    } else if (addressType === 'shipping') {
      setIsLoading(true);
      dispatch(setShippingAddress(address))
        .then(() => {
          setIsLoading(false);
          onSubmitSuccess();
          onDismiss();
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error.response);
          Alert.alert(
            'Error',
            `Opps, something went wrong while updating the ${addressType} address\nPlease try again `
          );
        });
    } else if (addressType === 'billing') {
      dispatch(setBillingAddress(address));
      onSubmitSuccess();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.root}
      enabled
    >
      {/* Modal header */}
      <Header title={title} onDismiss={onDismiss} />

      {/* Content */}
      <Block flex style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{
              first_name:
                '' || user?.[addressType]?.first_name || user?.first_name,
              last_name:
                '' || user?.[addressType]?.last_name || user?.last_name,
              address_1: '' || user?.[addressType]?.address_1,
              address_2: '' || user?.[addressType]?.address_2,
              company: '' || user?.[addressType]?.company,
              city: '' || user?.[addressType]?.city,
              state: '' || user?.[addressType]?.state,
              postcode: '' || user?.[addressType]?.postcode,
              email: '' || user?.billing?.email || user?.email,
              phone: '' || user?.billing?.phone,
            }}
            onSubmit={(values) => handleAddressSubmit(values)}
            validationSchema={yup.object().shape({
              first_name: yup.string().required('First Name is required'),
              last_name: yup.string().required('Last Name is required'),
              address_1: yup.string().required('Address is required'),
              address_2: yup.string(),
              company: yup.string(),
              city: yup.string().required('City is required'),
              state: yup
                .string()
                .matches(/(ON)/, 'Currently we are available in Ontario only')
                .required('Province is required'),
              postcode: yup
                .string()
                .matches(postalCodeRegExp, 'Postal Code is not valid')
                .required('Postal Code is required'),
              email: yup
                .string()
                .email('Email is not valid')
                .required('Email is required'),
              phone: yup
                .string()
                .matches(phoneRegExp, 'Mobile Phone number is not valid')
                .required('Mobile Phone Number is required'),
            })}
          >
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
            }) => (
              <React.Fragment>
                <CostumInput
                  name='first_name'
                  label='First Name *'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                  autoCapitalize='words'
                />
                <CostumInput
                  name='last_name'
                  label='Last Name *'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                  autoCapitalize='words'
                />
                <CostumInput
                  name='address_1'
                  label='Address Line 1*'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                />
                <CostumInput
                  name='address_2'
                  label='Address Line 2(Optional)'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                  autoCapitalize='words'
                />
                <CostumInput
                  name='company'
                  label='Company(Optional)'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                  autoCapitalize='words'
                />
                <CostumInput
                  name='city'
                  label='City*'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                  autoCapitalize='words'
                />

                <CostumInput
                  type='select'
                  name='state'
                  label='Province*'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                  items={[
                    { label: 'Ontario', value: 'ON' },
                    { label: 'Quebec', value: 'QC' },
                    { label: 'Alberta', value: 'AL' },
                    { label: 'British Columbia', value: 'BC' },

                    { label: 'Manitoba', value: 'MB' },
                    { label: 'New Brunswick', value: 'NB' },
                    {
                      label: 'Newfoundland and Labrador Northwest Territories',
                      value: 'NL',
                    },
                    { label: 'Nova Scotia', value: 'NS' },
                    { label: 'Nunavut', value: 'NU' },
                    { label: 'Prince Edward Island', value: 'PE' },
                    { label: 'Saskatchewan', value: 'SK' },
                    { label: 'Yukon', value: 'YT' },
                  ]}
                />

                <CostumInput
                  name='postcode'
                  label='Postal Code*'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                  autoCapitalize='characters'
                />

                <CostumInput
                  name='phone'
                  label='Mobile Phone Number*'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                />
                <CostumInput
                  name='email'
                  label='Email *'
                  values={values}
                  errors={errors}
                  isfocused={isfocused}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldTouched={setFieldTouched}
                  setIsfocused={setIsfocused}
                  autoCapitalize='none'
                />

                <Block middle>
                  <Button
                    loading={isLoading}
                    round
                    shadowless
                    color={isValid ? 'rgb(76,175,80)' : 'grey'}
                    disabled={!isValid || isLoading}
                    onPress={handleSubmit}
                    style={styles.submitButton}
                  >
                    Save
                  </Button>
                </Block>
              </React.Fragment>
            )}
          </Formik>
        </ScrollView>
      </Block>
    </KeyboardAvoidingView>
  );
};

//Custum input
const CostumInput = ({
  name,
  label,
  values,
  handleChange,
  setFieldTouched,
  errors,
  isfocused,
  setIsfocused,
  touched,
  type,
  items,
  ...rest
}) => {
  return (
    <Block style={styles.inputContainer}>
      {/* Input label */}
      <Text style={styles.inputLabel}>{label}</Text>

      {/* Text input */}
      {type === 'textInput' && (
        <React.Fragment>
          <TextInput
            value={values[name]}
            onChangeText={handleChange(name)}
            onFocus={() => setIsfocused({ name: name })}
            onBlur={() => {
              setIsfocused({ name: '' });
              setFieldTouched(name);
            }}
            style={
              isfocused.name == name
                ? [styles.input, styles.inputActive]
                : styles.input
            }
            {...rest}
          />
          {touched[name] && errors[name] && (
            <Text style={styles.helperText}>{errors[name]}</Text>
          )}
        </React.Fragment>
      )}

      {/* Select input */}
      {type === 'select' && (
        <Block style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={handleChange(name)}
            value={values[name]}
            placeholder={{
              label: 'Select a state...',
              value: '',
            }}
            items={items}
            onOpen={() => setIsfocused({ name: name })}
            onClose={() => {
              setIsfocused({ name: '' });
              setFieldTouched(name);
            }}
            style={{
              ...pickerStyles,
              inputIOS: {
                borderColor:
                  isfocused.name === name
                    ? 'rgb(51,110,187)'
                    : 'rgb(182,182,182)',
              },
              inputAndroid: {
                borderColor:
                  isfocused.name === name
                    ? 'rgb(51,110,187)'
                    : 'rgb(182,182,182)',
              },
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return (
                <Icon
                  family='Ionicons'
                  name='arrow-drop-down'
                  size={32}
                  color='gray'
                />
              );
            }}
          />
          {touched[name] && errors[name] && (
            <Text style={styles.helperText}>{errors[name]}</Text>
          )}
        </Block>
      )}
    </Block>
  );
};

//CUSTUM INPUT PROPTYPES
CostumInput.defaultProps = {
  type: 'textInput',
  items: [],
};

CostumInput.propTypes = {};

//ADDRESS MODAL PROPTYPES
AddressForm.defaultProps = {};

AddressForm.propTypes = {
  type: PropTypes.oneOf(['shipping', 'billing']),
  title: PropTypes.string,
  onDismiss: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },

  pickerContainer: {
    paddingVertical: 8,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(182,182,182)',
  },

  title: {
    marginBottom: 16,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    marginBottom: 16,
    fontWeight: '400',
  },
  input: {
    color: 'black',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(182,182,182)',
  },

  inputActive: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgb(51,110,187)',
    borderBottomColor: 'rgb(51,110,187)',
  },

  helperText: {
    fontSize: 10,
    color: 'red',
  },
  submitButton: { width: '90%', marginBottom: 32 },
});

const pickerStyles = StyleSheet.create({
  iconContainer: {
    // top: -8,
    right: 12,
  },
  inputIOS: {
    color: 'black',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
  },
  inputAndroid: {
    color: 'black',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default AddressForm;
