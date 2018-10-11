import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from './store';

class Login extends Component{
  constructor(){
    super();
    this.state = {
      name: '',
      password: ''
    };
    this.onChange = this.onChange.bind(this);
    this.login = this.login.bind(this);
  }
  login(ev){
    ev.preventDefault();
    console.log(this.state);
    const { name, password } = this.state;
    const credentials = { name, password };
    this.props.login(credentials)
      .catch(ex => console.log(ex));
  }
  onChange(ev){
    this.setState({[ev.target.name]: ev.target.value});
  }
  render(){
    const { name, password } = this.state;
    const { onChange, login } = this;
    return (
      <form onSubmit={ login }>
        <input className='form-control' name='name' value={ name } onChange={ onChange } />
        <input className='form-control' name='password' value={ password } onChange={ onChange } />
        <button className='btn btn-primary'>Login</button>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch, { history })=> ({
  login: (credentials)=> dispatch(login(credentials, history))
});

export default connect(null, mapDispatchToProps)(Login);
