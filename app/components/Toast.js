import { Block } from 'galio-framework';
import * as React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import * as actionType from '../store/actions/notification';
import LottieView from 'lottie-react-native';
import Text from './Text';

//TODO:review and implement it better way
//add message type warning,
//add duration for auto hide
const Toast = () => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = React.useState(false);
  const [text, setText] = React.useState({
    text: '',
    isVisible: false,
    color: '#282828',
  });
  const [animationPath, setAnimationPath] = React.useState('');
  const message = useSelector((state) => state.notification.message);

  React.useEffect(() => {
    if (message) {
      switch (message) {
        case 'item added to cart': {
          let path = require('../assets/animations/shoppingCart.json');
          setAnimationPath(path);
          setIsVisible(true);
          return;
        }
        case 'item added to favlist': {
          let path = require('../assets/animations/heart.json');
          setAnimationPath(path);
          setIsVisible(true);
          return;
        }
        case 'All available items in your cart': {
          let path = require('../assets/animations/shoppingCart.json');
          setText({ text: message, isVisible: true, color: 'white' });
          setAnimationPath(path);
          setIsVisible(true);
          return;
        }
      }
    }
  }, [message]);

  return (
    <React.Fragment>
      {isVisible && (
        <Block
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            elevation: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Block style={{ width: '100%', height: '20%', maxheight: 200 }}>
            <LottieView
              source={animationPath}
              onAnimationFinish={() => {
                setIsVisible(false);
                setText({ text: '', isVisible: false, color: '#282828' });
                dispatch(actionType.clearNotification());
              }}
              autoPlay
              loop={false}
            />
          </Block>
          {text.isVisible && (
            <Block
              style={{
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
                backgroundColor: 'rgb(255,124,37)',
              }}
            >
              <Text
                size={14}
                color={text.color}
                style={{ fontFamily: 'TruenoSBd', fontWeight: '500' }}
              >
                {message}
              </Text>
            </Block>
          )}
        </Block>
      )}
    </React.Fragment>
  );
};

export default Toast;
