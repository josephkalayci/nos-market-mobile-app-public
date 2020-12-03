import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Alert,
  Share,
} from 'react-native';

//Galio imports
import { Block, theme, Icon } from 'galio-framework';

//Redux related imports
import { useSelector } from 'react-redux';

//Custom components
import InfoText from '../InfoText';
import Text from '../Text';
import SearchBar from './SearchBar';

//Other imports
import { useNavigation, useRoute } from '@react-navigation/native';

//Assets
import headerLogo from '../../assets/images/headerLogo.png';

//Chat button
const ChatButton = () => {
  const url = 'https://wa.me/+16474939303';

  const handlePress = () => {
    Alert.alert(
      '',
      'Devam tuşuna basarak Whatsapp ile mesajlaşmaya başlayabilirsiniz',
      [
        {
          text: 'İptal',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'Devam', onPress: () => openChatApp() },
      ],
      { cancelable: true }
    );
  };

  const openChatApp = React.useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <TouchableOpacity
      style={[styles.button]}
      hitSlop={{ left: 8, right: 8, top: 8, bottom: 8 }}
      onPress={handlePress}
    >
      <Icon
        family='evilicons'
        size={32}
        name='comment'
        color={theme.COLORS['ICON']}
      />
    </TouchableOpacity>
  );
};

//Share button
const ShareButton = () => {
  const route = useRoute();
  const product = useSelector(
    (state) => state.products.byId[route.params?.productId]
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: product.data.permalink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (!product.data?.permalink) {
    return null;
  }
  return (
    <TouchableOpacity
      style={[styles.button]}
      hitSlop={{ left: 8, right: 8, top: 8, bottom: 8 }}
      onPress={onShare}
    >
      <Icon
        family='evilicons'
        size={32}
        name='share-apple'
        color={theme.COLORS['ICON']}
      />
    </TouchableOpacity>
  );
};

//Dissmiss button
const DismissButton = ({ ...rest }) => {
  return (
    <TouchableOpacity
      style={[styles.button]}
      hitSlop={{ left: 8, right: 8, top: 8, bottom: 8 }}
      {...rest}
    >
      <Icon
        family='evilicons'
        size={32}
        name='close'
        color={theme.COLORS['ICON']}
      />
    </TouchableOpacity>
  );
};

const Header = (props) => {
  const { title, search, logo, back, share, chat, onDismiss } = props;

  const navigation = useNavigation();

  //Show network error below header if exist
  const hasNetworkError = useSelector((state) => state.app.hasNetworkError);

  //Error state
  const [showError, setShowError] = React.useState(false);

  //LayoutAnimation inside InfoText affects react navigation transition animation
  //Thats why wait until navigation animation to finish then show error
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', () => {
      setShowError(true);
    });

    return unsubscribe;
  }, [navigation]);

  //Render searchbar
  const renderSearch = () => {
    const { search } = props;
    if (search) {
      return (
        <SearchBar
          navigation={navigation}
          type={title !== 'Search' ? 'button' : null}
        />
      );
    }
  };

  //Render title
  //If there is a logo render logo else render title component else render nothing
  const renderTitle = () => {
    if (logo) {
      return <Image source={headerLogo} style={styles.logo} />;
    }

    if (typeof title === 'string') {
      return (
        <Block>
          <Text style={styles.title}>{title}</Text>
        </Block>
      );
    }

    if (!title) return null;

    return title;
  };

  //Render left
  const renderLeft = () => {
    if (back) {
      return (
        <TouchableOpacity
          style={[styles.button, { marginLeft: 0 }]}
          onPress={() => navigation.goBack()}
        >
          <Icon
            family='evilicons'
            size={38}
            name='chevron-left'
            color={theme.COLORS['ICON']}
          />
        </TouchableOpacity>
      );
    }
  };

  //Render right
  const renderRight = () => {
    if (chat && share) {
      return [<ChatButton key='chat' />, <ShareButton key='search' />];
    }

    if (chat) {
      return <ChatButton />;
    }

    if (onDismiss) {
      return <DismissButton onPress={onDismiss} />;
    }
  };

  return (
    <React.Fragment>
      <Block safe style={[styles.root, styles.shadow]}>
        {/* First row of header */}
        <Block row style={styles.firstRow}>
          {/* Left */}
          <Block style={styles.left}>{renderLeft()}</Block>
          {/* Middle */}
          <Block middle style={styles.middle}>
            {renderTitle()}
          </Block>
          {/* Right */}
          <Block row style={styles.right}>
            {renderRight()}
          </Block>
        </Block>
        {/* Second row of header */}
        {search && <Block style={styles.secondRow}>{renderSearch()}</Block>}
      </Block>
      {/* Error message below header */}
      {showError && (
        <InfoText
          severity='error'
          showContent={hasNetworkError}
          style={{ marginVertical: 4 }}
        >
          {'Opps, It seems like you have connection problem'}
        </InfoText>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    zIndex: 100,
    elevation: 100,
  },
  firstRow: {
    height: 16 * 4.125 - 16,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  secondRow: {
    height: 16 * 4.125 - 16,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  left: {},
  middle: {
    height: '100%',
    position: 'absolute',
  },
  right: { marginLeft: 'auto' },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.BLACK,
  },
  logo: {
    height: 30,
    maxWidth: 200,
    resizeMode: 'contain',
  },
  button: {
    marginLeft: 16,
    position: 'relative',
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
});

export default Header;
