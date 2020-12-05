import { Block } from 'galio-framework';
import * as React from 'react';
import { StyleSheet, LayoutAnimation } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as actionType from '../store/actions/notification';
import LottieView from 'lottie-react-native';
import Text from './Text';
import InfoText from './InfoText';

const animationType = {
  heart: require('../assets/animations/heart.json'),
  cart: require('../assets/animations/shoppingCart.json'),
};

const defaultDuration = 1000;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Toast = () => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = React.useState(false);

  const messageId = useSelector((state) => state.notification.id);
  const message = useSelector((state) => state.notification.message);
  const messageType = useSelector((state) => state.notification.messageType);
  const animationName = useSelector((state) => state.notification.animation);
  const duration = useSelector((state) => state.notification.duration);

  React.useLayoutEffect(() => {
    if (!!messageId) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setIsVisible(true);
      setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setIsVisible(false);
        dispatch(actionType.clearNotification());
      }, duration || defaultDuration);
    }
  }, [messageId]);

  const renderAnimationWithText = () => {
    return (
      <Block style={styles.container}>
        <LottieView
          style={styles.animation}
          source={animationType[animationName]}
          onAnimationFinish={() => {}}
          autoPlay
          duration={duration || defaultDuration}
          loop={false}
        />
        <InfoText textSize={14} onlyText severity={messageType}>
          {message}
        </InfoText>
      </Block>
    );
  };
  const renderOnlyText = () => {
    return (
      <Block style={styles.container}>
        <InfoText textSize={14} onlyText severity={messageType}>
          {message}
        </InfoText>
      </Block>
    );
  };
  const renderOnlyAnimation = () => (
    <Block style={styles.container}>
      <LottieView
        style={styles.animation}
        source={animationType[animationName]}
        onAnimationFinish={() => {}}
        autoPlay
        duration={duration || defaultDuration}
        loop={false}
      />
    </Block>
  );

  if (!isVisible) {
    return null;
  }

  if (!!animationType[animationName] && !!message) {
    return renderAnimationWithText();
  }

  if (!!animationType[animationName]) {
    return renderOnlyAnimation();
  }

  if (!!message) {
    return renderOnlyText();
  }

  //      dispatch(actionType.clearNotification());
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    flex: 1,
    width: '100%',
    height: '20%',
    maxHeight: 200,
  },
  textContainer: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgb(255,124,37)',
  },
});

export default Toast;
