import React from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

//Galio import
import { Block, Icon, theme } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../store/actions/products';

//Custom UI components
import Text from '../components/Text.js';
import ProductCard from '../components/Cards/ProductCard.js';
import Loader from '../components/Loader.js';

//For pagination, keeps track of current page for each category
let options = { page: 1, per_page: 15 };
//
let isCancelled = false;

const CategoryScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  //category ref for auto scroll to current category
  const categoryRef = React.useRef(null);

  //Order is important!!
  //First get category id from route
  const { categoryId } = route.params;

  //Second get categories from store
  const categories = useSelector((state) => state.categories.categories);

  //Third set active category id to the id comes from route
  //or set it to the first category comes from store
  const [activeCategoryId, setActiveCategoryId] = React.useState(
    categoryId ? categoryId : categories[0].id
  );

  const hasNetworkError = useSelector((state) => state.app.hasNetworkError);

  const [searchResult, setSearchResult] = React.useState([]);

  const [isLoading, setIsloading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    options = { page: 1, per_page: 15 };
    setSearchResult([]);
    if (activeCategoryId === 'featured') {
      options.featured = true;
    } else {
      options.category = activeCategoryId;
    }
    fetchProducts(options);
    const timer = setTimeout(() => {
      if (isCancelled) return;
      categoryRef.current?.scrollToIndex({
        index: categories.findIndex((el) => el.id === activeCategoryId),
        animated: true,
      });
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [activeCategoryId]);

  //Clears async api calls
  React.useEffect(() => {
    return () => {
      isCancelled = true;
    };
  }, []);

  const fetchProducts = () => {
    isCancelled = false;
    setIsloading(true);
    dispatch(actionTypes.fetchProducts(options))
      .then((response) => {
        //if query cancelled dont update anything
        if (isCancelled) {
          return;
        }

        if (options.page == 1) {
          setSearchResult(response.data);
        } else {
          setSearchResult([...searchResult, ...response.data]);
        }

        //if there is no data set current page to -1
        //that way we dont fetch next page
        if (response.data.length < options.per_page) {
          options.page = -1;
        }
        setIsloading(false);
        setRefreshing(false);
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }
        //TODO: add error handler here
        setIsloading(false);
        setRefreshing(false);
      });
  };

  const handleRefresh = () => {
    if (hasNetworkError) {
      return;
    }
    setRefreshing(true);
    options.page = 1;
    fetchProducts();
  };

  //Fetch next page when distance to the bottom less than 40px
  const handleOnScroll = ({ nativeEvent }) => {
    const paddingToBottom = 100;
    if (
      isCloseToBottom(nativeEvent, paddingToBottom) &&
      options.page > 0 &&
      !isLoading &&
      !refreshing
    ) {
      //Fetch next page
      ++options.page;
      fetchProducts();
    }
  };

  //Helper function for onScrool handler
  const isCloseToBottom = (
    { layoutMeasurement, contentOffset, contentSize },
    paddingToBottom
  ) => {
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const renderSearchResult = () => (
    <FlatList
      data={searchResult}
      keyExtractor={(item, index) => index}
      numColumns={3}
      contentContainerStyle={{
        marginHorizontal: 8,
      }}
      renderItem={({ item, index }) => (
        <Block
          style={[
            index % 3 == 1 && {
              borderRightWidth: 0.5,
              borderLeftWidth: 0.5,
              borderColor: '#eee',
            },
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

  const renderLoading = () => (
    <Block flex middle>
      <Loader style={{ height: 40 }} />
    </Block>
  );

  const renderEmptyResult = () => (
    <Block flex middle style={{ marginTop: 32 }}>
      <Icon
        name='error-outline'
        family='materialicons'
        color={theme.COLORS.BLACK}
        size={24}
      />
      <Text muted>No item found</Text>
      <Text muted>Pull to refresh to try again</Text>
    </Block>
  );

  return (
    <Block flex>
      {/* Categories */}
      <Block>
        <FlatList
          ref={categoryRef}
          data={categories}
          keyExtractor={(item, index) => String(index)}
          style={{}}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={30}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveCategoryId(item.id)}
              style={[
                styles.categoryContainer,
                styles.shadow,
                activeCategoryId === item.id && styles.activeCategory,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  activeCategoryId === item.id && styles.activeText,
                ]}
              >
                {item.name.split('&amp;').join(' & ')}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Block>

      {/* Seperator */}
      <Block style={styles.separator} />

      {/* Search Result */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={handleOnScroll}
        scrollEventThrottle={1000}
      >
        <Block flex>
          {renderSearchResult()}
          {isLoading
            ? renderLoading()
            : searchResult.length == 0 && renderEmptyResult()}
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  activeCategory: {
    backgroundColor: 'rgb(0,92,168)',
    shadowColor: 'rgb(0,92,168)',
  },
  categoryContainer: {
    height: 12 * 2.75,
    borderWidth: 0.5,
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#eee',
    backgroundColor: 'white',
  },
  text: { fontSize: 16, fontWeight: '400', color: '#282828' },
  activeText: { color: 'white' },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 12,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default CategoryScreen;
