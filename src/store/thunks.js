import axios from 'axios';
import { _loadProducts, _setCount, _setAuth, _loadOrders } from './actions';

//count and products
const loadCount = ()=> {
  return (dispatch)=> {
    return axios.get('/api/count')
      .then( response => response.data)
      .then(({ count })=> dispatch(_setCount(count)));
  };
};

const loadProducts = ()=> {
  return (dispatch)=> {
    return axios.get('/api/products')
      .then( response => response.data)
      .then((products)=> dispatch(_loadProducts(products)));
  };
};

//auth
const axiosAuthHeader = ()=> ({
  headers: {
    authorization: window.localStorage.getItem('token')
  }
});

const exchangeTokenForAuth = (history)=> {
  return (dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(!token){
      return; 
    }
    return axios.get('/api/auth', {
      headers: {
        authorization: token
      }
    })
    .then( response => response.data)
    .then( auth => {
      return dispatch(_setAuth(auth));
    }) 
    .then(()=> {
      return dispatch(loadOrders());
      if(history){
        history.push('/cart');
      }
      
    })
    .catch( ex => {
      if(ex.response.status === 401){
        window.localStorage.removeItem('token');
      }
    });
  };
};

const logout = ()=> {
  window.localStorage.removeItem('token');
  return _setAuth({});
};

const login = (credentials, history)=> {
  return (dispatch)=>{
    return axios.post('/api/auth', credentials)
    .then(response => response.data)
    .then( data => {
      window.localStorage.setItem('token', data.token);
      dispatch(exchangeTokenForAuth(history));
    });
  };
};

//orders
const loadOrdersFromServer = (userId) => (
  axios.get(`/api/users/${ userId }/orders`, axiosAuthHeader())
      .then( response => response.data)
);

const loadOrders = ()=> {
  return (dispatch, getState)=> {
    const state = getState();
    const userId = state.auth.id;
    let promise;
    if(userId){
      promise = loadOrdersFromServer(userId);
    }
    return promise
      .then( orders => dispatch(_loadOrders(orders))); 
  };
};

const createOrder = (cart, history)=> {
  return (dispatch, getState)=> {
    const state = getState();
    const userId = state.auth.id;
    return axios.put(`/api/users/${ userId }/orders/${cart.id}`, { status: 'ORDER'}, axiosAuthHeader())
      .then( response => response.data)
      .then( orders => {
        dispatch(loadOrders(orders));
        dispatch(loadCount());
      }) 
      .then( () => history.push('/orders')); 
  };
};

//cart
const addToServerCart = (cart, product, quantity, lineItem)=> {
  let url, method, body; 
  if(lineItem){
    url = `/api/users/${cart.userId}/orders/${cart.id}/lineItems/${lineItem.id}`;
    method = 'put';
    quantity = quantity + lineItem.quantity;
    body = { quantity };
  }
  else {
    url = `/api/users/${cart.userId}/orders/${cart.id}/lineItems`;
    method = 'post';
    body = {
      quantity,
      productId: product.id
    };
  }
  return axios[method](url, body, axiosAuthHeader())
    .then( response => response.data);
};

const removeFromServerCart = (cart, lineItem)=> {
  const quantity = lineItem.quantity - 1;
  let method, body;
  const url = `/api/users/${cart.userId}/orders/${cart.id}/lineItems/${lineItem.id}`;
  if(lineItem.quantity === 0){
    method = 'delete';
  }
  else {
    method = 'put';
    body = {
      quantity,
    };
  }
  return axios[method](url, body || null, axiosAuthHeader())
    .then( response => response.data);
};


const addToCart = (cart, product, quantity, lineItem)=> {
  return (dispatch, getState)=> {
    const state = getState();
    const userId = state.auth.id;
    let promise;
    if(userId){
      promise = addToServerCart(cart, product, quantity, lineItem);
    }
    return promise
      .then( () => dispatch(loadOrders())); 
  };
};

const removeFromCart = (cart, lineItem)=> {
  return (dispatch, getState)=> {
    const state = getState();
    const userId = state.auth.id;
    let promise;
    if(userId){
      promise = removeFromServerCart(cart, lineItem);
    }
    return promise
      .then( () => dispatch(loadOrders())); 
  };
};

const reset = ()=> {
  return (dispatch)=> {
    return axios.post('/api/reset')
      .then( response => response.data)
      .then( () => {
        dispatch(_loadOrders([]));
        dispatch(_setCount(0));
      }); 
  };
};



export { createOrder, removeFromCart, loadOrders, addToCart, reset, exchangeTokenForAuth, login, logout, loadCount, loadProducts };
