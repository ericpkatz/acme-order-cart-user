import { combineReducers } from 'redux';
import { SET_COUNT, SET_AUTH, LOAD_ORDERS, LOAD_PRODUCTS } from './constants';


const ordersReducer = ( state = [], action)=> {
  switch(action.type){
    case LOAD_ORDERS:
      state = action.orders;
      break;
  }
  return state;
};

const productsReducer = ( state = [], action)=> {
  switch(action.type){
    case LOAD_PRODUCTS:
      state = action.products;
      break;
  }
  return state;
};

const countReducer = ( state = 0, action)=> {
  switch(action.type){
    case SET_COUNT:
      state = action.count;
      break;
  }
  return state;
};

const authReducer = ( state = {}, action)=> {
  switch(action.type){
    case SET_AUTH:
      state = action.auth;
      break;
  }
  return state;
};

export default combineReducers({
  orders: ordersReducer,
  auth: authReducer,
  count: countReducer,
  products: productsReducer
});
