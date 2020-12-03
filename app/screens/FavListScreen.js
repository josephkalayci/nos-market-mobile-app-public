import React from 'react';
import {
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

//Galio imports
import { Block, theme, Icon } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as productActions from '../store/actions/products';
import { setSortCriteria } from '../store/actions/favList';
import { getFavouriteProducts } from '../store/selectors';

//Custom components
import Text from '../components/Text';
import Loader from '../components/Loader';
import Radio from '../components/Inputs/Radio';
import ProductCard from '../components/Cards/ProductCard';

//Other imports
import Modal from 'react-native-modal';
import _ from 'lodash';
import ErrorView from '../components/ErrorView';

const { width } = Dimensions.get('screen');
const FavListScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [showingBottomSheet, setShowingBottomSheet] = React.useState(false);

  const favListById = useSelector((state) => state.favList.byId);
  const sortBy = useSelector((state) => state.favList.sortBy);
  const sortOptions = useSelector((state) => state.favList.sortOptions);
  const products = useSelector(
    (state) => getFavouriteProducts(state, sortBy),
    _.isEqual
  );

  React.useEffect(() => {
    let isCancelled = false;
    //TODO:improve here - fetch only missing items
    if (Object.keys(favListById).length != 0) {
      setIsLoading(true);

      dispatch(
        productActions.fetchProducts({ includes: Object.keys(favListById) })
      )
        .then(() => {
          if (isCancelled) {
            return;
          }
          setIsLoading(false);
        })
        .catch((error) => {
          if (isCancelled) {
            return;
          }
          setError(error);
          setIsLoading(false);
        });
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  const renderLoading = () => {
    return (
      <Block flex middle>
        <Loader style={{ height: 100 }} />
      </Block>
    );
  };

  const renderEmthyScreen = () => (
    <Block flex middle>
      <ScrollView contentContainerStyle={styles.emthyScreenContainer}>
        <Icon
          name='heart'
          family='evilicons'
          color={theme.COLORS.BLACK}
          size={96}
        />
        <Text size={16} style={{ marginBottom: 8 }}>
          Favourites
        </Text>
        <Text muted>You don't have any favourites yet</Text>
        <Text muted>All your favourites will show up here</Text>
      </ScrollView>
    </Block>
  );

  const renderProducts = () => {
    if (sortBy === 'Category') {
      return (
        <ScrollView style={{ marginTop: 8 }}>
          {[...new Set(products.map((item) => item.categories[0]?.name))].map(
            (categoryName, index) => (
              <Block key={categoryName}>
                <Block row space='between' style={{ marginRight: 12 }}>
                  <Text bold muted style={styles.categoryName}>
                    {categoryName?.replace('&amp;', ' & ')}
                  </Text>

                  {index == 0 && (
                    <TouchableOpacity
                      onPress={() => setShowingBottomSheet(true)}
                      hitSlop={{ top: 5, bottom: 5, right: 5, left: 5 }}
                    >
                      <Icon
                        name='sort'
                        family='materialicons'
                        color={theme.COLORS.BLACK}
                        size={24}
                        hitslop={36}
                      />
                    </TouchableOpacity>
                  )}
                </Block>
                <Block style={styles.separator} />

                <FlatList
                  data={products.filter(
                    (el) => el.categories[0]?.name === categoryName
                  )}
                  keyExtractor={(listItem) => listItem.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    marginHorizontal: 8,
                    paddingTop: 16,
                  }}
                  renderItem={({ item }) => (
                    <ProductCard
                      product={item}
                      onPress={() =>
                        navigation.navigate('Product', {
                          productId: item.id,
                        })
                      }
                    />
                  )}
                />
              </Block>
            )
          )}
        </ScrollView>
      );
    } else {
      return (
        <Block flex>
          <FlatList
            data={products}
            keyExtractor={(listItem) => listItem.id.toString()}
            //columnWrapperStyle={{}}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginHorizontal: 8,
              paddingTop: 16,
            }}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() =>
                  navigation.navigate('Product', {
                    productId: item.id,
                  })
                }
              />
            )}
          />
        </Block>
      );
    }
  };

  //Sort options modal
  const renderModal = () => {
    return (
      <Block>
        <Text muted>{`Sort by`}</Text>
        <Block style={styles.radioButtonContainer} />
        {sortOptions.map((el) => (
          <Radio
            key={el}
            label={el}
            color='black'
            value={sortBy === el}
            onChange={(val) => {
              dispatch(setSortCriteria(el));
              setTimeout(() => setShowingBottomSheet(false), 600);
            }}
            containerStyle={{ marginBottom: 8 }}
          />
        ))}
      </Block>
    );
  };

  if (error) {
    return (
      <ErrorView
        onErrorFallback={() => {
          setIsLoading(true);

          dispatch(
            productActions.fetchProducts({ include: Object.keys(favListById) })
          )
            .then(() => {
              setError(false);
              setIsLoading(false);
            })
            .catch((error) => {
              setError(error);
              setIsLoading(false);
            });
        }}
        isLoading={isLoading}
      />
    );
  }

  if (!isLoading && products.length == 0) {
    return renderEmthyScreen();
  }

  return (
    <Block flex>
      {/* If there is a product and sort option is not category render folowing item */}
      {!isLoading && products.length != 0 && sortBy !== 'Category' && (
        <React.Fragment>
          <Block row space='between' style={styles.filter}>
            <Text muted>{`${products.length} items`}</Text>
            <TouchableOpacity
              onPress={() => setShowingBottomSheet(true)}
              hitSlop={{ top: 5, bottom: 5, right: 5, left: 5 }}
            >
              <Icon
                name='sort'
                family='materialicons'
                color={theme.COLORS.BLACK}
                size={24}
                hitslop={36}
              />
            </TouchableOpacity>
          </Block>
          <Block style={styles.separator} />
        </React.Fragment>
      )}

      {/* Render products */}
      {isLoading ? renderLoading() : renderProducts()}

      {/* Sort options modal */}
      <Modal
        isVisible={showingBottomSheet}
        style={styles.bottomModal}
        onBackdropPress={() => setShowingBottomSheet(false)}
        // set timeout due to iOS needing to make sure modal is closed
        // before presenting another view
        onModalHide={() => setTimeout(() => setShowingBottomSheet(false), 200)}
      >
        <Block style={styles.modalContent}>{renderModal()}</Block>
      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  emthyScreenContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '50%',
  },
  categoryName: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  radioButtonContainer: {
    marginVertical: 8,
    width: width - 32,
    height: 1,
    backgroundColor: '#eee',
  },
  filter: { marginTop: 8, marginBottom: 4, paddingHorizontal: 12 },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 12,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 0,
    flexShrink: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
});

export default FavListScreen;
