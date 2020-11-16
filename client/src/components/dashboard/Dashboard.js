import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { Link } from "react-router-dom";

class Dashboard extends Component {

  componentWillReceiveProps(nextProps){
    //push user to home page when logged out.
    if(!nextProps.auth.isAuthenticated) this.props.history.push('/');
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  onLogoutClick = (e) =>{
    e.preventDefault();
    this.props.logoutUser();
  };
  render() {
    const  { user }= this.props.auth;
    return (
      <div
        style= {{height: '75vh'}}
        className = "container-valign wrapper"
      >
        <div className ='row'>
          <div className="col s12 center-align">
            <h4>
              <b>Hello,</b> {user.username}
              <p className="flow-text grey-text text-darken-1">
                You are logged into this animal crossing app
              </p>
              <Link to='/users/me'>Edit Profile</Link>
              <br/>
              <Link to='/designs/me'>Create Design</Link>
            </h4>
          </div>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem"
            }}
            onClick={this.onLogoutClick}
            className="btn btn-large waves-light hoverable blue accent 3"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = (state) =>({
  auth: state.auth
});

export default connect(
  mapStateToProps, { logoutUser}
)(Dashboard);
