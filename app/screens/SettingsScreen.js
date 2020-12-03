import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';

import { Block, theme, Icon } from 'galio-framework';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as userActions from '../store/actions/user';
import Text from '../components/Text';
import Button from '../components/Buttons/Button';

const SettingsScreen = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const user = useSelector((state) => state.user.details);
  const [isLoading, setIsloading] = React.useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    setIsloading(true);

    setTimeout(() => {
      dispatch(userActions.signOut());
      setIsloading(false);
    }, 2000);
  };

  const renderSignInButton = () => {
    return (
      <Block flex style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Button
          color='rgb(0,92,168)'
          shadowColor='rgb(0,92,168)'
          onPress={() =>
            navigation.navigate('Login', { transition: 'vertical' })
          }
          style={[{ width: '100%', margin: 0 }]}
        >
          Sign In
        </Button>
      </Block>
    );
  };

  const renderSignOutButton = () => {
    return (
      <Block flex style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Button
          loading={isLoading}
          color='rgb(0,92,168)'
          shadowColor='rgb(0,92,168)'
          onPress={handleSignOut}
          style={{ width: '100%', margin: 0 }}
        >
          Sign Out
        </Button>
      </Block>
    );
  };

  const renderSignedInUserSettings = () => {
    return (
      <Block>
        {renderSignOutButton()}
        <Block style={styles.title}>
          <Text
            bold
            left
            size={theme.SIZES.BASE}
            style={{ marginTop: 20, paddingBottom: 5 }}
          >
            {`Hi, ${user.first_name}`}
          </Text>
        </Block>

        <SettingButton
          title={'My Account'}
          subTitle='on NosMarket.ca'
          iconFamily='antdesign'
          iconName='user'
          onPress={() => {
            Linking.openURL('https://nosmarket.ca/my-account/');
          }}
        />
        <SettingButton
          title={'Previous Purchases'}
          iconFamily='antdesign'
          iconName='clockcircleo'
          onPress={() => navigation.navigate('PastPurchases')}
        />
      </Block>
    );
  };
  const renderAppSettings = () => {
    return (
      <Block>
        <Block style={styles.title}>
          <Text
            bold
            left
            size={theme.SIZES.BASE}
            style={{ marginTop: 20, paddingBottom: 5 }}
          >
            More
          </Text>
        </Block>

        {/* <SettingButton
          title={'Notification Settings'}
          iconFamily='antdesign'
          iconName='notification'
          onPress={() => {
            Linking.canOpenURL('app-settings:')
              .then((supported) => {
                console.log(`Settings url works`);
                Linking.openURL('app-settings:');
              })
              .catch((error) => {
                console.log(`An error has occured: ${error}`);
              });
          }}
        /> */}
        <SettingButton
          title={'About & Legal'}
          subTitle='on NosMarket.ca'
          iconFamily='antdesign'
          iconName='infocirlceo'
          onPress={() => {
            Linking.openURL('https://nosmarket.ca/contact-us/');
          }}
        />
        <SettingButton
          title={'Get Help'}
          subTitle='on NosMarket.ca'
          iconFamily='antdesign'
          iconName='questioncircleo'
          onPress={() => {
            Linking.openURL('https://nosmarket.ca/contact-us/');
          }}
        />
      </Block>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.settings}
    >
      {isAuth ? renderSignedInUserSettings() : renderSignInButton()}
      {renderAppSettings()}
    </ScrollView>
  );
};

const SettingButton = (props) => {
  const { title, subTitle, iconName, iconFamily, onPress } = props;
  return (
    <Block>
      <TouchableOpacity onPress={onPress}>
        <Block
          row
          middle
          style={{
            marginBottom: 5,
          }}
        >
          <Block
            style={{
              paddingLeft: theme.SIZES.BASE,
              paddingRight: theme.SIZES.BASE,
            }}
          >
            <Icon size={20} bold name={iconName} family={iconFamily} />
          </Block>
          <Block
            row
            flex
            style={{
              borderBottomWidth: 0.5,
              padding: theme.SIZES.BASE / 1.5,
              paddingRight: theme.SIZES.BASE,
            }}
          >
            <Text size={14} style={{ marginRight: 'auto' }}>
              {title}
            </Text>
            {subTitle && (
              <Text
                muted
                size={12}
                style={{ marginLeft: 'auto', paddingRight: 10 }}
              >
                {subTitle}
              </Text>
            )}
            <Icon name='angle-right' family='font-awesome' />
          </Block>
        </Block>
      </TouchableOpacity>
    </Block>
  );
};

const styles = StyleSheet.create({
  settings: {
    paddingVertical: theme.SIZES.BASE / 3,
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2,
    paddingLeft: theme.SIZES.BASE,
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2,
  },
  shadow: {
    shadowColor: 'rgb(0,92,168)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.SIZES.OPACITY,
    shadowRadius: theme.SIZES.BUTTON_SHADOW_RADIUS,
  },
});

export default SettingsScreen;
