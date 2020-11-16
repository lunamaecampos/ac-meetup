import {
  SET_CURRENT_USER,
  USER_LOADING,
  UPDATE_CURRENT_USER
} from "../actions/types";

const isEmpty = require("is-empty");

const initalState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default (state=initalState, action) =>{
  console.log(state);
  console.log({...action.payload});
  switch(action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case UPDATE_CURRENT_USER:
      return {
        ...state,
        user: {...state.user, ...action.payload}
      }
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
