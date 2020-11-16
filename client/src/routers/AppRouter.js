import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from "../components/layout/Navbar";
import Landing from "../components/layout/Landing";
import Register from "../components/users/Register";
import Login from "../components/users/Login";
import Update from "../components/users/Update";
import PrivateRoute from '../routers/PrivateRoute';
import Dashboard from '../components/dashboard/Dashboard';
import CreateDesign from '../components/designs/Create';

const AppRouter = () => (
  <Router>
    <div className="App">
      <Navbar />
      <Route exact path="/" component={Landing} />
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" component={Login}/>
      <Switch>
        <PrivateRoute exact path="/dashboard" component={Dashboard}/>
        <PrivateRoute exact path="/users/me" component={Update}/>
        <PrivateRoute exact path="/designs/me" component={CreateDesign}/>
      </Switch>
    </div>
  </Router>
)

export default AppRouter
