import React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';

//Galio imports
import { Block } from 'galio-framework';

//Assets
import emtyCartImage from '../../assets/images/emtyCart.png';

const EmptyCartView = () => {
  return (
    <Block flex style={{ backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={emtyCartImage}
          style={{
            flex: 1,
            width: null,
            height: null,
            resizeMode: 'contain',
          }}
        />
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({});

export default EmptyCartView;
