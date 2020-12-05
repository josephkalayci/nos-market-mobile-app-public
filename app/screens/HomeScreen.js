import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  RefreshControl,
  UIManager,
  LayoutAnimation,
} from 'react-native';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../store/actions/products';
import { getProductsById } from '../store/selectors';

//Custom components
import Text from '../components/Text.js';
import Loader from '../components/Loader';
import ProductCard from '../components/Cards/ProductCard';
import Carausel from '../components/Carausel';
import AppConfig from '../constants/Config';

//Other imports
import { Block } from 'galio-framework';
import _ from 'lodash';
import ErrorView from '../components/ErrorView';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const hasLoadingError = useSelector((state) => state.app.hasLoadingError);
  const isLoading = useSelector((state) => state.app.isLoading);

  const carauselProducts = useSelector(
    (state) => getProductsById(state, state.products.carauselAllIds),
    _.isEqual
  );

  //Get featured products from store
  const firstRowProducts = useSelector(
    (state) => getProductsById(state, state.products.firstRowAllIds),
    _.isEqual
  );

  //Get top selling products from store
  const secondRowProducts = useSelector(
    (state) => getProductsById(state, state.products.secondRowAllIds),
    _.isEqual
  );

  const [refreshing, setRefreshing] = React.useState(false);

  /*  React.useLayoutEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }, []); */

  const initApp = () => {
    dispatch({ type: 'SET_LOADING_STATE', payload: true });

    Promise.all([
      dispatch(actionTypes.fetchCarauselProducts()),
      dispatch(actionTypes.fetchFirstRowProducts()),
      dispatch(actionTypes.fetchSecondRowProducts()),
    ])
      .then(() => {
        dispatch({ type: 'SET_LOADING_STATE', payload: false });
        dispatch({ type: 'SET_LOADING_ERROR', payload: false });
      })
      .catch(() => {
        dispatch({ type: 'SET_LOADING_ERROR', payload: true });
        dispatch({ type: 'SET_LOADING_STATE', payload: false });
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      dispatch(actionTypes.fetchCarauselProducts()),
      dispatch(actionTypes.fetchFirstRowProducts()),
      dispatch(actionTypes.fetchSecondRowProducts()),
    ])
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  };

  const renderLoading = () => (
    <Block flex style={[styles.sectionContainer, { minHeight: 100 }]}>
      <Loader />
    </Block>
  );

  const renderProducts = (products) => (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      style={styles.container}
      //refreshing={refreshing}
      horizontal
      scrollEnabled={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => navigation.navigate('Product', { productId: item.id })}
        />
      )}
      numRows={3}
      // onRefresh={() => {
      //   setRefreshing(true);
      //   dispatch(actionTypes.fetchProducts()).then(setRefreshing(false));
      // }}
    />
  );

  const CategoryCart = ({ item }) => (
    <Block flex style={styles.categoryCard}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CategoryScreen', {
            categoryId: item.id,
          })
        }
      >
        <Image source={item.image} style={styles.categoryCardImage} />
        <Text size={12} style={styles.categoryTitle}>
          {item.name.replace('&amp;', ' & ')}
        </Text>
      </TouchableOpacity>
    </Block>
  );

  if (hasLoadingError) {
    return (
      <ErrorView
        onErrorFallback={initApp}
        isLoading={isLoading}
        style={{ backgroundColor: '#FFFFFF' }}
      />
    );
  }
  return (
    <Block flex>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Carausel */}
        {isLoading ? renderLoading() : <Carausel items={carauselProducts} />}

        {/* Featured Items */}
        <Block flex style={styles.sectionContainer}>
          <Block row space='between' style={styles.sectionHeaderContainer}>
            <Text bold>{AppConfig.HomePage.firstRow.name}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CategoryScreen', {
                  categoryId: 'featured',
                })
              }
            >
              <Text muted>See All</Text>
            </TouchableOpacity>
          </Block>
          {isLoading ? renderLoading() : renderProducts(firstRowProducts)}
        </Block>

        {/* Top Selling Items */}
        <Block flex style={styles.sectionContainer}>
          <Block row space='between' style={styles.sectionHeaderContainer}>
            <Text bold>{AppConfig.HomePage.secondRow.name}</Text>
            {/* <TouchableOpacity>
              <Text muted>See All</Text>
            </TouchableOpacity> */}
          </Block>
          {isLoading ? renderLoading() : renderProducts(secondRowProducts)}
        </Block>

        {/* Categories */}
        <Block
          flex
          shadow
          style={[styles.sectionContainer, { backgroundColor: 'white' }]}
        >
          <Block row space='between' style={styles.sectionHeaderContainer}>
            <Text bold muted>
              Categories
            </Text>
            <TouchableOpacity
              // Pass emthy string to navigate to the first category
              onPress={() =>
                navigation.navigate('CategoryScreen', { categoryId: '' })
              }
            >
              <Text muted>See All</Text>
            </TouchableOpacity>
          </Block>
          <FlatList
            data={AppConfig.HomePage.categories}
            keyExtractor={(item) => String(item.id)}
            style={{}}
            scrollEnabled={false}
            renderItem={({ item }) => <CategoryCart item={item} />}
            numColumns={3}
          />
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 8,
  },
  sectionHeaderContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  categoryCard: {
    margin: 6,
    height: (Dimensions.get('window').width - 24 - 12 - 4) / 3, // approximate a square
  },
  categoryCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
    //transform: [{ rotate: '180deg' }],
  },
  categoryTitle: {
    position: 'absolute',
    left: 8,
    top: 8,
    fontWeight: '500',
    width: '70%',
    fontFamily: 'TruenoSBd',
    color: '#282828',
  },
});

export default HomeScreen;
