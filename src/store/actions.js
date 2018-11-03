import { LOAD_ORDERS, SET_AUTH, SET_COUNT, LOAD_PRODUCTS } from './constants';

const _loadOrders = (orders)=>({
  type: LOAD_ORDERS,
  orders
});

const _loadProducts = (products)=>({
  type: LOAD_PRODUCTS,
  products
});

const _setAuth = (auth)=>({
  type: SET_AUTH,
  auth
});

const _setCount = (count)=>({
  type: SET_COUNT,
  count
});

export {
  _loadProducts,
  _setAuth,
  _loadOrders,
  _setCount
};
