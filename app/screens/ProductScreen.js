import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';

//Galio imports
import { Block, Icon, theme } from 'galio-framework';

//Redux related imports
import { useSelector, useDispatch } from 'react-redux';
import * as lineItemActions from '../store/actions/lineItems';
import * as favListActions from '../store/actions/favList';
import * as productActions from '../store/actions/products';
import { getProductsById } from '../store/selectors';

//Custom components
import Text from '../components/Text';
import Header from '../components/Header/Header.js';
import ProductCard from '../components/Cards/ProductCard';
import Loader from '../components/Loader';

//Other imports
import AutoHeightWebView from 'react-native-autoheight-webview';
import RNPickerSelect from 'react-native-picker-select';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Button from '../components/Buttons/Button';

const { width, height } = Dimensions.get('screen');

//Header animation parameters
const HEADER_HEIGHT = 16 * 4.125 - 16;

//clear async calls on unmounth
let isCancelled = false;

const ProductScreen = ({ navigation, scene, route }) => {
  const dispatch = useDispatch();

  //Header animations
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  const translateY = diffClamp.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
  });

  //Product id comes from navigation
  const { productId } = route.params;

  //Get product from store
  const product = useSelector((state) => state.products.byId[productId]);

  //Get related product from store
  const relatedProducts = useSelector((state) =>
    getProductsById(state, product?.data.related_ids)
  );

  //Set out of stock true if it is not available or it is out of stock
  const [isOutOfStock, setIsOutOfStock] = React.useState(
    product?.data?.status !== 'publish' ||
      product?.data?.stock_status !== 'instock'
  );

  //Check if item is in fav list
  const isFavourite = useSelector((state) => state.favList.byId[productId]);

  const [isLoading, setIsloading] = React.useState(false);
  const [isRelatedLoading, setIsRelatedLoading] = React.useState(false);

  //Default quantity of the item
  const [quantity, setQuantity] = React.useState('1');

  const [isCartLoading, setIsCartLoading] = React.useState(false);
  const [isFavLoading, setIsFavLoading] = React.useState(false);

  //Main image of the item Default: first image of product.images
  const [mainImage, setMainImage] = React.useState('');

  React.useEffect(() => {
    setMainImage(product?.data.images?.[0]?.src);
    isCancelled = false;
    if (!product) {
      return;
    }
    //Fetch product if not exist or update data if not fresh
    //TTL_MS=5 minute
    const shouldCallApi = () => {
      const TTL_MS = 1000 * 60 * 30;
      const isCashed = Date.now() - product.updatedAt > TTL_MS ? false : true;
      return !product?.data || !isCashed;
    };
    if (shouldCallApi()) {
      setIsloading(true);
      dispatch(productActions.fetchSingleProduct(productId))
        .then(() => {
          if (isCancelled) return;
          setIsloading(false);
        })
        .catch(() => {
          if (isCancelled) return;
          setIsloading(false);
        });
    }

    console.log(
      'sss',
      product?.data?.related_ids?.length,
      relatedProducts.length
    );
    if (
      shouldCallApi() ||
      relatedProducts.length != product?.data?.related_ids?.length
    ) {
      setIsRelatedLoading(true);

      dispatch(
        productActions.fetchProducts({ include: product.data.related_ids })
      )
        .then(() => {
          if (isCancelled) return;
          setIsRelatedLoading(false);
        })
        .catch(() => {
          if (isCancelled) return;

          setIsRelatedLoading(false);
        });
    }
  }, [productId]);

  //Clears async api calls
  React.useEffect(() => {
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleAddToCart = () => {
    //Show fake loading for better UI experience
    setIsCartLoading(true);
    setTimeout(() => {
      setIsCartLoading(false);
    }, 2000);

    //Trigger haptic feedback
    ReactNativeHapticFeedback.trigger('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    //Add item to the cart
    dispatch(lineItemActions.addToCart(product.data.id, Number(quantity)));
  };

  const handleFavListUpdate = () => {
    //Show fake loading for better UI experience
    setIsFavLoading(true);

    //Trigger haptic feedback
    ReactNativeHapticFeedback.trigger('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    if (!isFavourite) {
      dispatch(favListActions.addToFavList(product.data.id));
      setTimeout(() => {
        setIsFavLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        dispatch(favListActions.removeFromFavList(product.data.id));
        setIsFavLoading(false);
      }, 1000);
    }
  };

  const getMaximumQuantity = () => {
    if (isOutOfStock) {
      return 0;
    }

    //if there is no stock management set maximum 100
    if (!product.data.manage_stock) {
      return 100;
    }

    if (
      product.data.stock_status !== 'instock' ||
      !product.data.stock_quantity
    ) {
      return 0;
    }

    return product.data.stock_quantity;
  };

  const FavButton = (props) => (
    <Button
      shadowless
      round
      style={{ width: '100%' }}
      onPress={props.onPress}
      color='#fff'
      onlyIcon
      loading={isFavLoading}
      icon={isFavourite ? 'heart' : 'hearto'}
      iconFamily='antdesign'
      iconSize={22}
      iconColor={'rgb(237,102,97)'}
      loadingColor={'rgb(237,102,97)'}
      style={[styles.buttonBase, styles.favButton]}
    />
  );

  const renderLoading = () => (
    <Block flex middle>
      <Loader style={{ height: 100 }} />
    </Block>
  );

  //TODO: use same icon family for both outlined and filled
  const renderRatings = () => {
    let avarageRating = 0;
    //If exist ceil rating to the upper integer
    if (Math.ceil(product.average_rating) > 0) {
      avarageRating = Math.ceil(product.average_rating);
    }
    return (
      <Block row>
        {Array.from(Array(avarageRating)).map((value, index) => (
          <Icon
            key={index}
            family='entypo'
            name='star'
            size={22}
            size={19}
            style={{ marginTop: -2 }}
          />
        ))}
        {Array.from(Array(5 - avarageRating)).map((value, index) => (
          <Icon key={index} family='evilicons' name='star' size={22} />
        ))}
      </Block>
    );
  };

  // Renders main image and tumblr
  const renderImages = () => (
    <Block>
      <Block>
        {/* Main image If there is no image render no image warning */}
        {mainImage ? (
          <Image source={{ uri: mainImage }} style={styles.mainImage} />
        ) : (
          <Block middle style={{ width: width, height: width / 2 }}>
            <Block
              shadow
              style={{
                backgroundColor: 'rgb(202,202,204)',
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text color={'#282828'}>No image available</Text>
            </Block>
          </Block>
        )}
      </Block>
      <Block>
        {/* product image tumblr */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          {product.data.images?.map((image, index) => {
            let isActive = mainImage == image?.src;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setMainImage(image?.src)}
                style={isActive && styles.tumblrImageActive}
              >
                <Image
                  source={{ uri: image?.src }}
                  style={[styles.tumblrImage]}
                />
                {!isActive && <Block style={styles.overlay} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Block>
    </Block>
  );

  const renderDescription = () => (
    <Block flex style={[styles.section, { minHeight: 150 }]}>
      <Text bold size={16} style={styles.sectionTitle}>
        Description
      </Text>

      <AutoHeightWebView
        originWhitelist={['*']}
        scrollEnabled={false}
        source={{
          html:
            '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' +
            product.data.short_description.split('<p>&nbsp;</p>').join('') +
            '</body></html>',
        }}
        style={{ flex: 1 }}
        startInLoadingState
        //style={styles.sectionContent}
      />
    </Block>
  );

  const renderPrice = () => (
    <Block row space='between' style={{ paddingTop: 8, paddingHorizontal: 16 }}>
      {product.data?.on_sale ? (
        <Block top style={styles.priceBanner}>
          <Text size={12} bold style={{ color: '#fff' }}>
            Reduced Price
          </Text>
        </Block>
      ) : (
        <Text muted>{`Price`}</Text>
      )}
      {product.data?.on_sale ? (
        <Block>
          <Text style={styles.price}>{`$${product.data?.sale_price}`}</Text>
          <Text muted style={styles.salePriceContainer}>
            {`Was $`}
            <Text style={styles.salePrice}>{product.data?.regular_price}</Text>
          </Text>
        </Block>
      ) : (
        <Text style={styles.price}>{`$${product.data?.regular_price} `}</Text>
      )}
    </Block>
  );

  const renderRelatedItems = () => (
    <Block flex>
      <Text bold size={16} style={[styles.sectionTitle, styles.section]}>
        Related Items
      </Text>

      {isRelatedLoading ? (
        renderLoading()
      ) : (
        <FlatList
          data={relatedProducts}
          keyExtractor={(item) => String(item.id)}
          style={{ flex: 1, paddingLeft: 8 }}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.push('Product', { productId: item.id })}
            />
          )}
        />
      )}
      {!isRelatedLoading && relatedProducts.length == 0 && (
        <Text style={{ marginLeft: 16, marginTop: -8 }} muted>
          There is no related items
        </Text>
      )}
    </Block>
  );

  return (
    <Block flex>
      {/* Space for status bar*/}
      <Block
        safe
        style={{
          backgroundColor: 'white',
          zIndex: 100,
        }}
      />
      {/* Header animation */}
      <Animated.View
        style={{
          transform: [{ translateY: translateY }],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          //height: HEADER_HEIGHT,
          zIndex: 50,
        }}
      >
        <Header
          title='Product Details'
          back
          chat
          share={product ? true : false}
          navigation={navigation}
          scene={scene}
          route={route}
        />
      </Animated.View>

      {/* Render product if exist */}
      {!product || isLoading ? (
        renderLoading()
      ) : (
        <React.Fragment>
          <Animated.ScrollView
            //bounces={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              let contentSize = e.nativeEvent.contentSize.height;
              let scroolPosition =
                e.nativeEvent.layoutMeasurement.height +
                e.nativeEvent.contentOffset.y;

              if (
                scroolPosition < contentSize &&
                e.nativeEvent.contentOffset.y >= 0
              ) {
                scrollY.setValue(e.nativeEvent.contentOffset.y);
              }
            }}
            style={{ paddingTop: HEADER_HEIGHT }}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='always'
          >
            {/* Product name and star ratings */}
            <Block style={{ paddingHorizontal: 16, marginTop: 24 }}>
              <Text style={styles.productName}>{product.data.name}</Text>
              {renderRatings()}
            </Block>

            {/* Main image and tumblr */}
            {renderImages()}

            {/* Quantity and fav button */}
            <Block row space='between' style={{ paddingHorizontal: 16 }}>
              {/* Quantity button */}
              <Block
                row
                center
                flex
                style={[styles.buttonBase, { marginRight: 16 }]}
              >
                <Text muted style={{ marginRight: 16 }}>
                  Quantity
                </Text>
                <RNPickerSelect
                  onValueChange={(value) => setQuantity(value)}
                  placeholder={{}}
                  value={quantity}
                  items={Array.from(Array(getMaximumQuantity()).keys()).map(
                    (el) => ({
                      label: String(el + 1),
                      value: String(el + 1),
                    })
                  )}
                  onOpen={() => {}}
                  onClose={() => {}}
                  //InputAccessoryView={() => null}
                  style={{
                    viewContainer: { flex: 1 },
                    inputIOS: {
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      color: 'black',
                    },
                    inputAndroid: {
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      color: 'black',
                    },
                  }}
                  useNativeAndroidPickerStyle={false}
                />
              </Block>
              {/* Fav button */}
              <FavButton onPress={handleFavListUpdate} />
            </Block>

            {/* section seperator */}
            <Block style={styles.seperator} />

            {/* render product description */}
            {renderDescription()}

            {/* section seperator */}
            <Block style={styles.seperator} />

            {renderRelatedItems()}

            <Block
              style={{
                height: HEADER_HEIGHT + 8,
              }}
            />
          </Animated.ScrollView>

          <Block
            style={{
              paddingHorizontal: 8,
              borderTopWidth: 1,
              borderColor: 'rgb(216,217,218)',
              backgroundColor: 'white',
            }}
          >
            {/* Price */}
            {renderPrice()}

            {/* Add to cart button */}
            <Block middle style={{ paddingBottom: 4, paddingHorizontal: 8 }}>
              <Button
                color={isOutOfStock ? 'grey' : 'rgb(0,92,168)'}
                loading={isCartLoading}
                disabled={isOutOfStock}
                shadowless
                round
                style={{ width: '100%' }}
                onPress={handleAddToCart}
              >
                {isOutOfStock ? 'Out of stock' : 'Add To Cart'}
              </Button>
            </Block>
          </Block>
        </React.Fragment>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  mainImage: {
    width: width,
    height: width / 2,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  tumblrImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  tumblrImageActive: { borderBottomWidth: 2, borderColor: 'rgb(43,102,159)' },
  productName: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '400',
    color: 'rgb(34,34,34)',
  },
  price: {
    fontSize: 22,
    marginBottom: 4,
    fontWeight: '700',
    color: 'rgb(34,34,34)',
  },
  salePriceContainer: {
    fontWeight: '400',
    marginBottom: 4,
  },
  salePrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  priceBanner: {
    backgroundColor: 'rgb(50,51,52)',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 16,
  },
  buttonBase: {
    margin: 0,
    marginTop: 16,
    width: (width - 48) / 3,
    height: 16 * 2.75,
    borderColor: 'rgb(216,217,218)',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 8,
  },
  favButton: { borderColor: 'rgb(227,94,23)' },
  seperator: {
    marginLeft: 10,
    marginVertical: 16,
    borderWidth: 0.5,
    borderColor: 'rgb(221, 221, 221)',
  },
  section: { paddingHorizontal: 16, marginBottom: 32 },
  sectionTitle: { color: 'rgb(43,101,159)', marginBottom: 16 },
  sectionContent: { flex: 1 },
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

export default ProductScreen;
