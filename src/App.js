import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset, loadProducts, loadOrders, exchangeTokenForAuth } from './store';
import { Route, HashRouter as Router } from 'react-router-dom';
import Orders from './Orders';
import Cart from './Cart';
import Nav from './Nav';
import Login from './Login';

class App extends Component{
  componentDidMount(){
    this.props.init();
  }
  render(){
    const { itemsSold, reset, loggedIn } = this.props;
    return (
      <div>
        <Router>
          <div>
            <Route component={ ({ location })=> <Nav path={ location.pathname }/> } />
            <div className='container'>
            <div className='alert alert-success'>
            { itemsSold } Items Sold!!
            </div>
            <button onClick={ reset } className='btn btn-warning'>Reset</button>
            {
              !loggedIn && (
                <Route exact path='/login' component={ Login } /> 
              )
            }
            {
              loggedIn && (
                <div>
                <Route exact path='/cart' component={ Cart } /> 
                <Route exact path='/orders' component={ Orders } /> 
                </div>
              )
            }
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch)=> {
  return {
    init: ()=> {
      dispatch(exchangeTokenForAuth());
      dispatch(loadProducts());
      /*
      dispatch(loadProducts());
      dispatch(loadOrders());
      */
    },
    reset: ()=> dispatch(reset())
  };
};

const mapStateToProps = ({ products, orders, auth })=> {
  const itemsSold = orders.filter(order => order.status === 'ORDER')
    .reduce((memo, order)=> {
      memo = [...memo, ...order.lineItems];
      return memo;
    }, [])
    .reduce((memo, lineItem)=> {
      memo+= lineItem.quantity;
      return memo;
    }, 0);
  const loggedIn = auth.id;
  return {
    itemsSold,
    products,
    auth,
    loggedIn
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
