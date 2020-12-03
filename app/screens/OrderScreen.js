import React from 'react';
import { Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

//React navigation imports
import { CommonActions } from '@react-navigation/native';

//Galio imports
import { Block } from 'galio-framework';

//Assets
import orderPlaced from '../assets/images/orderPlaced.png';
import Button from '../components/Buttons/Button';

const { width } = Dimensions.get('window');
const OrderScreen = ({ navigation }) => {
  return (
    <Block flex>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Block flex center middle>
          <Image source={orderPlaced} style={styles.image} />
          <Button
            round
            color='rgb(214,51,58)'
            onPress={() => {
              navigation.navigate('Home');
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Cart' }],
                })
              );
            }}
            style={styles.button}
          >
            {'Continue shopping'}
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: { flexGrow: 1 },
  image: {
    width: width,
    height: width * 1.067,
    resizeMode: 'contain',
  },
  button: { shadowColor: '#c12e35' },
});

export default OrderScreen;
