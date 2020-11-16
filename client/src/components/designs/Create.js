import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import { createDesign } from '../../actions/authActions';
import classnames from 'classnames';


class CreateDesign extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      creator: '',
      creatorID: '',
      island: '',
      designtype: '',
      designID: '',
      rating: '',
      screenshot: '',
      errors: ''
    };
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.auth.isAuthenticated) this.props.history.push('/');
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value});
  };
  onSubmit = (e) =>{
    e.preventDefault();
    if(!Object.keys(this.state.errors).length){
      const newDesign = {
        name: this.state.name,
        creator: '',
        island: '',
        designtype: '',
        designID: '',
        rating: '',
        screenshot: '',
        errors: ''
      };
      this.props.createDesign(newDesign, this.props.history);
    }
  };
  render(){
    const { errors } = this.state;
    return (
      <div className="container">
        <div style={{marginTop: "4rem"}} className="row">
          <div className="row">
            <div className="col s8 offset-s2">
              <Link to="/dashboard" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back to
                Dashboard
              </Link>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                  <b>Upload Your Own Designs</b> below
                </h4>
                <p className="grey-text text-darken-1">
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.username}
                    error={errors.username}
                    id="username"
                    type="text"
                    className={classnames("", {
                    invalid: errors.username
                  })}
                  />
                  <label htmlFor="name">Username</label>
                  <span className="red-text">{errors.name}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="email"
                    className={classnames("", {
                    invalid: errors.email
                  })}
                  />
                  <label htmlFor="email">Email</label>
                  <span className="red-text">{errors.email}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                    className={classnames("", {
                    invalid: errors.password
                  })}
                  />
                  <label htmlFor="password">Password</label>
                  <span className="red-text">{errors.password}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.password2}
                    error={errors.password2}
                    id="password2"
                    type="password"
                    className={classnames("", {
                    invalid: errors.password2
                  })}
                  />
                  <label htmlFor="password2">Confirm Password</label>
                  <span className="red-text">{errors.password2}</span>
                </div>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                  <button
                    style={{
                      width: "150px",
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "1rem"
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable accent-3 register-btn"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CreateDesign.propTypes = {
  createDesign: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})
export default connect(mapStateToProps, {createDesign })(withRouter(CreateDesign));
