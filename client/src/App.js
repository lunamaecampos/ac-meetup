import React, { Component } from 'react';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import AppRouter from './routers/AppRouter';
import './styles/App.css';

import { Provider } from "react-redux";
import store from "./store/configureStore";


const jwt = require('jsonwebtoken');

//check to see if user is logged in
if(localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);

  jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (error, decoded)=> {
    if(error){
        store.dispatch(logoutUser());
        window.location.href="/";
        localStorage.removeItem('jwtToken');
    }else {
      store.dispatch(setCurrentUser(decoded));
    }
  });

  // store.dispatch(setCurrentUser(decoded));
  //
  // //check for expired token
  // const currentTime = Date.now() / 1000; //get time in milliseconds
  // if(decoded.exp <currentTime) {
  //   store.dispatch(logoutUser());
  //   window.location.href="./login";
  // }
}



class App extends Component {
  render(){
    return (
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
  }
}

export default App;
