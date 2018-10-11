const LOAD_PRODUCTS = 'LOAD_PRODUCTS';
const LOAD_ORDERS = 'LOAD_ORDERS';
const SET_AUTH = 'SET_AUTH';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import axios from 'axios';

const exchangeTokenForAuth = (history)=> {
  return (dispatch)=> {
    const token = window.localStorage.getItem('token');
    console.log(token);
    if(!token){
      return 
    }
    return axios.get('/api/auth', {
      headers: {
        authorization: token
      }
    })
    .then( response => response.data)
    .then( auth => {
      dispatch(_setAuth(auth))
      dispatch(loadOrders());
    }) 
    .catch( ex => {
      console.log(ex);
      window.localStorage.removeItem('token')
    })
  }
}

const logout = ()=> {
  window.localStorage.removeItem('token');
  return _setAuth({});
}

const login = (credentials, history)=> {
  return (dispatch)=>{
    return axios.post('/api/auth', credentials)
    .then(response => response.data)
    .then( data => {
      window.localStorage.setItem('token', data.token);
      dispatch(exchangeTokenForAuth(history));
    })
  }
};


const productsReducer = ( state = [], action)=> {
  switch(action.type){
    case LOAD_PRODUCTS:
      state = action.products;
      break;
  }
  return state;
};

const ordersReducer = ( state = [], action)=> {
  switch(action.type){
    case LOAD_ORDERS:
      state = action.orders;
      break;
  }
  return state;
};

const authReducer = ( state = [], action)=> {
  switch(action.type){
    case SET_AUTH:
      state = action.auth;
      break;
  }
  return state;
};

const reducer = combineReducers({
  products: productsReducer,
  orders: ordersReducer,
  auth: authReducer
});

export default createStore(reducer, applyMiddleware(thunk));


const _loadProducts = (products)=>({
  type: LOAD_PRODUCTS,
  products
});

const _loadOrders = (orders)=>({
  type: LOAD_ORDERS,
  orders
});

const _setAuth = (auth)=>({
  type: SET_AUTH,
  auth
});


const loadProducts = ()=> {
  return (dispatch)=> {
    return axios.get('/api/products')
      .then( response => response.data)
      .then( products => dispatch(_loadProducts(products))); 
  }
};

const axiosAuthHeader = ()=> ({
      headers: {
        authorization: window.localStorage.getItem('token')
      }
});

const loadOrders = ()=> {
  return (dispatch)=> {
    return axios.get('/api/orders', axiosAuthHeader())
      .then( response => response.data)
      .then( orders => dispatch(_loadOrders(orders))); 
  }
};

const addToCart = (cart, product, lineItem)=> {
  return (dispatch)=> {
    if(lineItem){
        return axios.put(`/api/orders/${cart.id}/lineItems/${lineItem.id}`, { quantity: ++lineItem.quantity}, axiosAuthHeader())
          .then( response => response.data)
          .then( orders => dispatch(loadOrders(orders))); 
    }
    else {
        return axios.post(`/api/orders/${cart.id}/lineItems`, { quantity: 1, productId: product.id}, axiosAuthHeader())
          .then( response => response.data)
          .then( orders => dispatch(loadOrders(orders))); 
    }
  }
};
const removeFromCart = (cart, lineItem)=> {
  return (dispatch)=> {
    if(lineItem.quantity !== 1){
        return axios.put(`/api/orders/${cart.id}/lineItems/${lineItem.id}`, { quantity: --lineItem.quantity}, axiosAuthHeader())
          .then( response => response.data)
          .then( orders => dispatch(loadOrders(orders))); 
    }
    else {
        return axios.delete(`/api/orders/${cart.id}/lineItems/${lineItem.id}`, axiosAuthHeader())
          .then( response => response.data)
          .then( orders => dispatch(loadOrders(orders))); 
    }
  }
};

const reset = ()=> {
  return (dispatch)=> {
        return axios.post('/api/reset')
          .then( response => response.data)
          .then( orders => dispatch(loadOrders(orders))) 
    }
};

const createOrder = (cart, history)=> {
  return (dispatch)=> {
        return axios.put(`/api/orders/${cart.id}`, { status: 'ORDER'}, axiosAuthHeader())
          .then( response => response.data)
          .then( orders => dispatch(loadOrders(orders))) 
          .then( () => history.push('/orders')); 
    }
};

export { createOrder, removeFromCart, loadProducts, loadOrders, addToCart, reset, exchangeTokenForAuth, login, logout };
