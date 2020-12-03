import React from 'react';
import { StyleSheet, Animated, TouchableOpacity, Keyboard } from 'react-native';

//Galio imports
import { theme, Block, Text, Icon } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../../store/actions/search';

//Custom components

//Other imports
import _ from 'lodash';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Input from '../Inputs/Input';

const SearchBar = ({ navigation, type }) => {
  const dispatch = useDispatch();

  const searchTerm = useSelector((state) => state.search.searchTerm);

  const [isFocused, setIsFocused] = React.useState(true);

  const animatedWidth = React.useRef(new Animated.Value(1)).current;

  const onChangeHandler = (text) => {
    dispatch({
      type: actionTypes.SET_SEARCH_TERM,
      data: text,
    });
  };

  React.useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: isFocused ? 1 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  return (
    <React.Fragment>
      {type === 'button' ? (
        /* Dummy input for presentation purppose
           On click navigates to search screen and focuses to real input */
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('ProductSearchScreen')}
          style={styles.searchContainer}
        >
          <Block center row space='between' style={[styles.search]}>
            <Text style={{ color: 'rgb(117, 117, 117)' }}>
              What are you looking for?
            </Text>
            <Icon
              name='magnifying-glass'
              family='entypo'
              color={theme.COLORS.BLACK}
              size={18}
            />
          </Block>
        </TouchableWithoutFeedback>
      ) : (
        <Block row style={styles.searchContainer}>
          {/* Search input */}
          <Animated.View
            style={[
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '80%'],
                }),
              },
            ]}
          >
            <Input
              right
              color='black'
              style={[styles.search]}
              placeholderTextColor={'rgb(117, 117, 117)'}
              placeholder='What are you looking for?'
              autoFocus={isFocused}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={searchTerm}
              onChangeText={onChangeHandler}
              family='entypo'
              icon='magnifying-glass'
              iconColor={theme.COLORS.BLACK}
              iconSize={18}
            />
          </Animated.View>
          {/* Cancel button */}
          <Animated.View
            style={[
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '20%'],
                }),
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setIsFocused(false), Keyboard.dismiss();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text numberOfLines={1} ellipsizeMode='clip'>
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Block>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  searchContainer: { height: '100%' },
  search: {
    paddingHorizontal: theme.SIZES.INPUT_HORIZONTAL,
    flex: 1,
    width: '100%',
    borderWidth: 0,
    borderRadius: 48,
    backgroundColor: 'rgb(241, 241, 241)',
    color: 'rgb(117, 117, 117)',
  },
});

export default SearchBar;
