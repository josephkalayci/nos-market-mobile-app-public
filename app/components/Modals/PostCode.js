import React from 'react';
import {
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';

//Galio imports
import { Block } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as userActions from '../../store/actions/user';

//Custom components
import Header from '../Header/Header.js';
import Text from '../Text.js';
import Button from '../Buttons/Button';
//Other imports
import * as yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

//Assets
import backgroundMedia from '../../assets/images/postCodeModal.png';

const PostCode = ({ onDismiss }) => {
  const dispatch = useDispatch();

  //Get shipping address from store
  const shippingAddress = useSelector((state) => state.user.details?.shipping);

  //Loading state
  const [isLoading, setIsLoading] = React.useState(false);

  //Input focused state
  const [isfocused, setIsfocused] = React.useState({
    name: 'itemName',
  });

  //Regex validation for postcode
  const postalCodeRegExp = /([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i;

  //Submit handler
  const handleSubmit = (postCode) => {
    let address = { ...shippingAddress, ...postCode };

    if (shippingAddress && postCode === shippingAddress?.postcode) {
      onDismiss();
    } else {
      setIsLoading(true);
      dispatch(userActions.setShippingAddress(address))
        .then(() => {
          setIsLoading(false);
          onDismiss();
        })
        .catch((error) => {
          setIsLoading(false);
          Alert.alert(
            'Error',
            'Opps, something went wrong while updating postcode\nPlease try again '
          );
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.root}
      enabled
    >
      {/* Modal header */}
      <Header logo title='postcode' onDismiss={onDismiss} />

      {/* Modal content */}
      <Block flex style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{
              postcode: '' || shippingAddress?.postcode,
            }}
            onSubmit={(values) => handleSubmit(values)}
            validationSchema={yup.object().shape({
              postcode: yup
                .string()
                .matches(postalCodeRegExp, 'Postal Code is not valid')
                .required('Postal Code is required'),
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
              <Block flex space='between'>
                <Block middle>
                  <Image source={backgroundMedia} style={styles.imageStyle} />
                </Block>

                <Block middle>
                  <Text bold style={styles.heading}>
                    Tell us your location
                  </Text>
                  <Text style={styles.helperText}>
                    Type in your postal code below so we can provide you with
                    the most accurate delivery information
                  </Text>
                  <CostumInput
                    name='postcode'
                    label='Your postal code'
                    values={values}
                    errors={errors}
                    isfocused={isfocused}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldTouched={setFieldTouched}
                    setIsfocused={setIsfocused}
                    autoCapitalize='characters'
                  />

                  <Button
                    round
                    shadowless
                    color={isValid ? 'rgb(76,175,80)' : 'grey'}
                    disabled={!isValid}
                    loading={isLoading}
                    onPress={handleSubmit}
                    style={styles.submitButton}
                  >
                    Confirm
                  </Button>
                </Block>
              </Block>
            )}
          </Formik>
        </ScrollView>
      </Block>
    </KeyboardAvoidingView>
  );
};

//Custom input
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
  ...rest
}) => {
  return (
    <Block center style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={values[name]?.toUpperCase()}
        onChangeText={handleChange(name)}
        style={styles.input}
        {...rest}
      />
      {touched[name] && errors[name] && (
        <Text style={styles.errorText}>{errors[name]}</Text>
      )}
    </Block>
  );
};

//CUSTOM INPUT PROPTYPES
CostumInput.defaultProps = {};

CostumInput.propTypes = {};

//POSTCODE PROPTYPES
PostCode.defaultProps = {};

PostCode.propTypes = {
  onDismiss: PropTypes.func,
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
  imageStyle: {
    maxHeight: 300,
    resizeMode: 'center',
  },
  heading: { color: 'rgb(43,101,159)' },
  helperText: {
    margin: 8,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    marginTop: 24,
    marginBottom: 4,
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
    color: 'rgb(51,110,187)',
  },
  input: {
    minWidth: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    borderColor: 'rgb(51,110,187)',
    color: 'rgb(51,110,187)',
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
  submitButton: { width: '90%', marginBottom: 32 },
});

export default PostCode;
