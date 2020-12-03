import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
//Galio imports
import { Block } from 'galio-framework';

//Carausel
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { useNavigation } from '@react-navigation/native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  'window'
);

//Get platform
const IS_IOS = Platform.OS === 'ios';

//Slider first item index
const SLIDER_1_FIRST_ITEM = 1;

const Carausel = ({ items }) => {
  //First item index to be shown in carausel
  const [slider1ActiveSlide, setSlider1ActiveSlide] = React.useState(
    SLIDER_1_FIRST_ITEM
  );
  const sliderRef = React.useRef('c');

  //Render each slide
  const renderItem = ({ item, index }) => {
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
  };

  return (
    <Block safe>
      <Carousel
        ref={sliderRef}
        data={items}
        renderItem={renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
        hasParallaxImages={false}
        firstItem={SLIDER_1_FIRST_ITEM}
        inactiveSlideScale={1}
        inactiveSlideOpacity={0.7}
        inactiveSlideShift={0}
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={styles.sliderContentContainer}
        loop={true}
        //loopClonesPerSide={2}
        autoplay={true}
        autoplayDelay={1000}
        autoplayInterval={10000}
        onSnapToItem={(index) => setSlider1ActiveSlide(index)}
      />
      <Pagination
        dotsLength={items.length}
        activeDotIndex={slider1ActiveSlide}
        containerStyle={styles.paginationContainer}
        dotColor={'rgba(255, 255, 255, 0.92)'}
        dotStyle={styles.paginationDot}
        inactiveDotColor={colors.black}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
        carouselRef={sliderRef}
        tappableDots={!!sliderRef}
      />
    </Block>
  );
};

const SliderEntry = (props) => {
  const { id, images } = props.data;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.slideInnerContainer}
      onPress={() => {
        navigation.navigate('Product', { productId: id });
      }}
    >
      <View style={styles.shadow} />
      <View style={styles.imageContainer}>
        <Image source={{ uri: images[0]?.src }} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
};
const colors = {
  black: '#1a1917',
};

const styles = StyleSheet.create({
  slider: {
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    // paddingVertical: 10, // for custom animation
  },
  paginationContainer: {
    marginTop: -8,
    paddingVertical: 2,
  },
  paginationDot: {
    width: 24,
    height: 2,
    borderRadius: 2,
    marginHorizontal: 0.2,
  },
  slideInnerContainer: {
    width: '100%',
    height: viewportHeight * 0.26,
    //paddingBottom: 18, // needed for shadow
    paddingBottom: 0,
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'stretch',
  },
});

export default Carausel;
