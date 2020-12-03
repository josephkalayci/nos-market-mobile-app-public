//TODO: Use reselect for memorized state

//FAVOURITE LIST SELECTORS

/**
 * Returns filtered products by catagory name
 * @param {Object}   state           redux store
 * @param {String}   categoryName    category name
 * @return {Array}   filtered products by catagory name
 */
export const getProductsByCategoryId = (state, categoryId) => {
  let result = [];
  const itemsById = state.products.byId;
  const itemsAllIds = state.products.allIds;

  //TODO:rewrite with clear and effient way

  itemsAllIds.forEach((id) => {
    if (itemsById[id].category === categoryId) {
      result.push(itemsById[id].data);
    }
  });
  return result;
};

/**
 * Returns filtered products by id
 * @param {Object}   state           redux store
 * @param {Array}    itemList        id list
 * @return {Array}   filtered products by id
 */
export const getProductsById = (state, itemList = []) => {
  let result = [];
  const items = state.products.byId;

  itemList.forEach((id) => {
    if (items[id]) {
      result.push(items[id].data);
    }
  });
  return result;
};

/**
 * Returns products in favourite list
 * @param {Object}   state           redux store
 * @return {Array}   products in faurite list
 */
export const getFavouriteProducts = (state, sortBy) => {
  let result = [];
  const items = state.products.byId;
  const favList = state.favList.allIds;

  favList.forEach((id) => {
    if (items[id]) {
      result.push(items[id].data);
    }
  });
  if (sortBy === 'Price') {
    return result.sort((a, b) => a.price - b.price);
  }

  return result;
};

//LINEITEMS SELECTORS

/**
 * Returns total item quantity in cart
 * @param {Object}   state           redux store
 * @return {Number}   total item quantity
 */
export const getTotalItemQuantityInCart = (state) => {
  const items = state.lineItems.byId;
  const allIds = state.lineItems.allIds;
  if (!Object.keys(items).length) {
    return 0;
  }

  return allIds.reduce(
    (sum, currentVal) => sum + Number(items[currentVal].quantity),
    0
  );
};
