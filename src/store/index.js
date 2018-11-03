import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

export default createStore(reducer, applyMiddleware(thunk, logger));


export {
  loadOrders,
  exchangeTokenForAuth,
  createOrder,
  addToCart,
  removeFromCart,
  login,
  logout,
  loadCount,
  reset,
  loadProducts
} from './thunks';

