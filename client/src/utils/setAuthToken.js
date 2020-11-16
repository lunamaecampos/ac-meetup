import axios from "axios";

const setAuthToken = (token) =>{
  if(token){
    //apply auth token to all logged-in requests
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
