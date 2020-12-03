import React from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

//Galio imports
import { Block, Icon, theme } from 'galio-framework';

//Redux related imports
import { useDispatch, useSelector } from 'react-redux';
import { getProductsById } from '../store/selectors.js';

//Custom components
import Text from '../components/Text.js';
import ProductCard from '../components/Cards/ProductCard.js';
import Loader from '../components/Loader.js';

//Other imports
import _ from 'lodash';
import {
  searchProducts,
  SET_IS_SEARCHING,
  SET_SEARCH_RESULT,
} from '../store/actions/search.js';
import { SET_ITEMS } from '../store/actions/products.js';

let isCancelled = false;
const ProductSearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const searchResult = useSelector((state) => state.search.result);
  const isLoading = useSelector((state) => state.search.isSearching);

  //TODO:replace dummy id with featured category id
  //Get featured products from store
  const featuredProducts = useSelector(
    (state) => getProductsById(state, state.products.firstRowAllIds),
    _.isEqual
  );

  //Delay query 500ms if user is still typing
  const delayedQuery = React.useCallback(
    _.debounce((q) => {
      console.log(q);
      sendQuery(q);
    }, 500),
    []
  );

  const sendQuery = (query) => {
    isCancelled = false;
    dispatch(searchProducts(query))
      .then((response) => {
        if (isCancelled) {
          return;
        }
        dispatch({
          type: SET_ITEMS,
          data: response.data,
        });
        dispatch({
          type: SET_SEARCH_RESULT,
          data: response.data,
        });
        return response;
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        dispatch({
          type: SET_IS_SEARCHING,
          data: false,
        });
      });
  };

  React.useEffect(() => {
    if (searchTerm) {
      isCancelled = true;
      delayedQuery.cancel();
      delayedQuery(searchTerm);
    } else {
      delayedQuery.cancel();
      dispatch({
        type: SET_IS_SEARCHING,
        data: false,
      });
      dispatch({
        type: SET_SEARCH_RESULT,
        //searchTerm: '',
        data: [],
      });
    }
  }, [searchTerm]);

  const renderSearchResult = () => {
    if (searchTerm && searchResult.length > 0) {
      return (
        // Search result
        <FlatList
          data={searchResult}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={{
            marginHorizontal: 8,
            paddingTop: 16,
          }}
          renderItem={({ item, index }) => (
            <Block
              style={[
                index % 3 == 1
                  ? {
                      borderRightWidth: 0.5,
                      borderLeftWidth: 0.5,
                      borderColor: '#eee',
                    }
                  : {},
                { borderBottomWidth: 0.5, borderColor: '#eee' },
              ]}
            >
              <ProductCard
                product={item}
                onPress={() =>
                  navigation.navigate('Product', { productId: item.id })
                }
                noShadow
              />
            </Block>
          )}
        />
      );
    } else if (!searchTerm) {
      return (
        // Featured items
        <FlatList
          data={featuredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={{
            marginHorizontal: 8,
            paddingTop: 16,
          }}
          renderItem={({ item, index }) => (
            <Block
              style={[
                index % 3 == 1
                  ? {
                      borderRightWidth: 0.5,
                      borderLeftWidth: 0.5,
                      borderColor: '#eee',
                    }
                  : {},
                { borderBottomWidth: 0.5, borderColor: '#eee' },
              ]}
            >
              <ProductCard
                product={item}
                onSelect={() =>
                  navigation.navigate('Product', { productId: item.id })
                }
                noShadow
              />
            </Block>
          )}
          ListHeaderComponent={
            <React.Fragment>
              <Text bold muted style={styles.sectionHeaderContainer}>
                {'Featured Products'}
              </Text>
              <Block style={styles.separator} />
            </React.Fragment>
          }
        />
      );
    }
  };

  const renderEmthyResult = () => (
    <Block middle style={{ marginTop: 32 }}>
      <Icon
        name='error-outline'
        family='materialicons'
        color={theme.COLORS.BLACK}
        size={24}
      />
      <Text muted>No item found</Text>
    </Block>
  );

  const renderLoading = () => (
    <Block flex middle style={[{ marginTop: 8 }]}>
      <Loader style={[{ height: 40 }]} />
    </Block>
  );

  return (
    <Block flex style={styles.root}>
      <ScrollView bounces={true}>
        {/* Search result info render if there is a result */}
        {searchTerm !== '' && searchResult.length > 0 && (
          <React.Fragment>
            <Block flex row space='between' style={styles.filter}>
              <Text muted>{`${searchResult.length} items found`}</Text>
              {/* <TouchableOpacity onPress={() => {}}>
                <Icon
                  name='sort'
                  family='materialicons'
                  color={theme.COLORS.BLACK}
                  size={24}
                  hitslop={36}
                />
              </TouchableOpacity> */}
            </Block>
            <Block style={styles.separator} />
          </React.Fragment>
        )}

        {isLoading && renderLoading()}

        {/* Search resul */}
        {renderSearchResult()}

        {/* Render emthy result */}
        {searchTerm !== '' &&
          searchResult.length == 0 &&
          !isLoading &&
          renderEmthyResult()}
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  root: { paddingTop: 16 },
  filter: { marginVertical: 4, paddingHorizontal: 12 },
  sectionHeaderContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 12,
  },
});

export default ProductSearchScreen;
