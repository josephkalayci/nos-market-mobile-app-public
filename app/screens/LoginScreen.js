import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

// galio component
import { Block, Text } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as userActions from '../store/actions/user';

//Custom components
import theme from '../constants/Theme';
import startLogin from '../service/Login';
import Button from '../components/Buttons/Button';
import Input from '../components/Inputs/Input';
import { Formik } from 'formik';
import * as yup from 'yup';
import { fetchShippingRate } from '../store/actions/shipping';

const { height } = Dimensions.get('window');

//Custom input
const CostumInput = ({
  name,
  label,
  values,
  handleChange,
  errors,
  touched,
  ...rest
}) => {
  return (
    <Block style={{ marginBottom: 12 }}>
      <Input
        rounded
        placeholder={label}
        placeholderTextColor={'rgb(202,202,204)'}
        autoCapitalize='none'
        style={styles.input}
        onChangeText={handleChange(name)}
        {...rest}
      />
      {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
    </Block>
  );
};

const Login = ({ navigation }) => {
  const [loginError, setLoginError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const isAuth = useSelector((state) => state.user.isAuth);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isAuth) {
      navigation.goBack();
    }
  }, [isAuth]);

  const handleSignIn = async ({ email, password }) => {
    try {
      setLoginError('');
      setIsLoading(true);
      const { token, user } = await startLogin(email, password);
      dispatch(userActions.loginSuccess(token, user));

      setIsLoading(false);
    } catch (error) {
      if (error.type === 'auth_error') {
        setLoginError(error.message);
      } else {
        setLoginError('Opps! something went wrong. Please try again');
      }
      setIsLoading(false);
    }
  };

  return (
    <Block safe flex>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={(values) => handleSignIn(values)}
        validationSchema={yup.object().shape({
          email: yup.string().required('Email is required'),
          password: yup.string().required('Password is required'),
        })}
      >
        {({ values, handleChange, errors, touched, handleSubmit }) => (
          <TouchableWithoutFeedback
            style={{
              backgroundColor: 'yellow',
              flex: 1,
            }}
            onPress={() => Keyboard.dismiss()}
          >
            <Block flex style={styles.root}>
              <Block style={styles.titleContainer}>
                <Text
                  muted
                  center
                  size={theme.SIZES.FONT * 0.875}
                  style={{ paddingHorizontal: theme.SIZES.BASE * 2.3 }}
                >
                  Sign in with E-mail
                </Text>
              </Block>

              <Block style={styles.inputContainer}>
                <CostumInput
                  name='email'
                  label='Email'
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                />
                <CostumInput
                  name='password'
                  label='Password'
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  password
                  viewPass
                />
                {loginError ? (
                  <Text
                    muted
                    size={12}
                    style={{
                      marginLeft: 8,
                    }}
                  >
                    {loginError}
                  </Text>
                ) : null}
                <Text
                  color={'rgb(214,51,58)'}
                  size={12}
                  onPress={() => {
                    Linking.openURL(
                      'https://nosmarket.ca/my-account/lost-password/'
                    );
                  }}
                  style={{
                    alignSelf: 'flex-end',
                    lineHeight: theme.SIZES.FONT * 2,
                  }}
                >
                  Forgot your password?
                </Text>
              </Block>

              <Block style={styles.submitContainer}>
                <Button
                  loading={isLoading}
                  round
                  color='rgb(214,51,58)'
                  disabled={isLoading}
                  onPress={handleSubmit}
                  style={[styles.shadow, { width: '100%', margin: 0 }]}
                >
                  Sign in
                </Button>
              </Block>
            </Block>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    </Block>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 16,
    backgroundColor: theme.COLORS.WHITE,
  },
  titleContainer: { marginVertical: 16, height: height * 0.1 },
  inputContainer: { height: height * 0.3 },
  submitContainer: { marginVertical: 16 },

  input: { width: '100%', marginBottom: 4 },
  errorText: {
    fontSize: 10,
    marginLeft: 8,
    color: 'red',
  },
  shadow: {
    shadowColor: 'rgb(214,51,58)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.SIZES.OPACITY,
    shadowRadius: theme.SIZES.BUTTON_SHADOW_RADIUS,
  },
});

export default Login;
