import React from 'react';
import { StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import PropTypes from 'prop-types';
import { Block, Icon, theme } from 'galio-framework';
import Text from './Text';

const infoTextStyles = {
  info: {
    iconFamily: 'MaterialIcons',
    iconName: 'info-outline',
    backgroundColor: 'rgb(32,150,243)',
  },
  error: {
    iconFamily: 'MaterialIcons',
    iconName: 'error-outline',
    backgroundColor: 'rgb(244,68,54)',
  },
  success: {
    iconFamily: 'MaterialIcons',
    iconName: 'check-circle',
    backgroundColor: 'rgb(76,175,80)',
  },
  warning: {
    iconFamily: 'MaterialIcons',
    iconName: 'warning',
    backgroundColor: 'rgb(255,152,0)',
  },
};

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

//TODO: review necessity of showContent prop
const InfoText = ({
  severity,
  iconSize,
  textSize,
  children,
  color,
  style,
  showContent,
  ...rest
}) => {
  React.useLayoutEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }, [showContent]);

  if (showContent) {
    return (
      <Block
        row
        style={[
          styles.root,
          styles.shadow,

          {
            backgroundColor: color
              ? color
              : infoTextStyles[severity]?.backgroundColor,
          },
          style,
        ]}
        {...rest}
      >
        <Icon
          name={infoTextStyles[severity].iconName}
          family={infoTextStyles[severity].iconFamily}
          color={'white'}
          size={iconSize}
        />
        <Text size={textSize} style={styles.text}>
          {children}
        </Text>
      </Block>
    );
  } else {
    return null;
  }
};
InfoText.defaultProps = {
  styles: {},
  iconSize: 18,
  textSize: 12,
  showContent: true,
  severity: 'info',
};

InfoText.propTypes = {
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  color: PropTypes.string,
  styles: PropTypes.any,
  iconSize: PropTypes.number,
  textSize: PropTypes.number,
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderRadius: 4,
    margin: 4,
    padding: 4,
  },
  text: { color: 'white', marginLeft: 8, fontWeight: '500' },
  shadow: {
    shadowColor: theme.COLORS.BLOCK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: theme.SIZES.BLOCK_SHADOW_OPACITY,
    shadowRadius: theme.SIZES.BLOCK_SHADOW_RADIUS,
    elevation: theme.SIZES.ANDROID_ELEVATION,
  },
});

export default InfoText;
