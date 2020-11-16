import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  UPDATE_CURRENT_USER
} from "./types";
const jwt = require('jsonwebtoken');


// User Registration
export const registerUser = (userData, history) =>  (dispatch) =>{
  axios.post("/users/register", userData)
    .then((response)=> {
      const { token } = response.data;
      // Set token to Auth header
      setAuthToken(token);
      //save token to local storage
      localStorage.setItem("jwtToken", token);
      const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
      dispatch(setCurrentUser(decoded));
    }) // redirect to login when register success
    .catch((error)=> dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

// User Login
export const loginUser = (userData) => (dispatch) => {
  axios.post("/users/login", userData)
    .then((response)=>{

      const { token } = response.data;
      // Set token to Auth header
      setAuthToken(token);
      //save token to local storage
      localStorage.setItem("jwtToken", token);
      const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
      dispatch(setCurrentUser(decoded));
    })
    .catch((error)=> dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

// User Update
export const updateUser = (userData) => (dispatch) =>{
  console.log('hello');
  const token = localStorage.getItem("jwtToken");
  console.log(userData);
  console.log(token);
  axios.patch("/users/me", userData)
    .then((response)=>{
      const { user } = response.data;
      console.log(user);
      dispatch(updateCurrentUser(user))
    })
    .catch((error)=> dispatch({
      type: GET_ERRORS,
      payload:error.response.data
    }))
}
// Design Creation
export const createDesign = (designData, history) =>  (dispatch) =>{
  axios.post("/designs/create", designData)
    .then((response)=> {
      const { token } = response.data;
      // Set token to Auth header
      setAuthToken(token);
      //save token to local storage
      localStorage.setItem("jwtToken", token);
      const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
      dispatch(setCurrentUser(decoded));
    }) // redirect to login when register success
    .catch((error)=> dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

export const updateCurrentUser = (updates) => {
  return {
    type: UPDATE_CURRENT_USER,
    payload: updates
  }
}

//User Loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log User Out
export const logoutUser = (jwtToken) => (dispatch) => {
  const { jwtToken } = localStorage
  axios.post('/users/logout', jwtToken)
    .then((response)=> {

      //Remove token from local localStorage
      localStorage.removeItem("jwtToken");
      //Remove auth header for future requests
      setAuthToken(false);
      // Set current user to empty object {} which will set isAuthenticated to false
      dispatch(setCurrentUser({}))
    })
    .catch((error)=> dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
}
