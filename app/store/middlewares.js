export const cartMiddleware = (storeAPI) => (next) => (action) => {
  // Do something in here, when each action is dispatched
  let result = next(action);
  if (action.type === 'SET_ITEMS' || action.type === 'ADD_PRODUCT') {
    const lineItems = storeAPI.getState().lineItems.byId;

    const intersection =
      action.type === 'SET_ITEMS'
        ? action.data.some((el) => lineItems[el.id])
        : lineItems[action.data.id]
        ? true
        : false;

    if (intersection) {
      const inventory = storeAPI.getState().products.byId;
      const lineItemsAlIds = storeAPI.getState().lineItems.allIds;
      let totalTax = 0;
      let totalProductCost = 0;
      let totalItemQuantity = 0;
      for (let i = 0; i < lineItemsAlIds.length; i++) {
        const productId = lineItemsAlIds[i];
        if (inventory[productId]) {
          const quantity = Number(lineItems[productId].quantity);
          const price = Number(inventory[productId].data.price);

          totalTax = totalTax + price * quantity * 0.13;
          totalProductCost = totalProductCost + price * quantity;
          totalItemQuantity = totalItemQuantity + quantity;
        }
      }
      storeAPI.dispatch({
        type: 'UPDATE_STATS',
        totalTax: Number(totalTax.toFixed(2)),
        totalProductCost: Number(totalProductCost.toFixed(2)),
      });
    }
  }

  if (
    action.type === 'ADD_TO_CART' ||
    action.type === 'REMOVE_FROM_CART' ||
    action.type === 'UPDATE_QUANTITY'
  ) {
    const lineItems = storeAPI.getState().lineItems.byId;

    const inventory = storeAPI.getState().products.byId;

    const lineItemsAlIds = storeAPI.getState().lineItems.allIds;
    let totalTax = 0;
    let totalProductCost = 0;
    let totalItemQuantity = 0;

    for (let i = 0; i < lineItemsAlIds.length; i++) {
      const productId = lineItemsAlIds[i];
      if (inventory[productId]) {
        const quantity = Number(lineItems[productId].quantity);
        const price = Number(inventory[productId].data.price);
        const taxRate =
          inventory[productId].data.tax_class === 'hst-rate' ? 0.13 : 0;

        totalTax = totalTax + price * quantity * taxRate;
        totalProductCost = totalProductCost + price * quantity;
        totalItemQuantity = totalItemQuantity + quantity;
      }
    }
    storeAPI.dispatch({
      type: 'UPDATE_STATS',
      totalTax: Number(totalTax.toFixed(2)),
      totalProductCost: Number(totalProductCost.toFixed(2)),
    });
  }

  return result;
};
