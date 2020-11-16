import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateUser } from '../../actions/authActions';
import classnames from 'classnames';

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.user ? this.props.user.username : '',
      email: this.props.auth.user ? this.props.user.email : '',
      password: '',
      password2: '',
      switchID: this.props.user ? this.props.user.switchID : '',
      avatar: this.props.user ? this.props.user.avatar : '',
      prevAvatarRef: props.user ? props.user.avatar : '',
      isUploading: false,
      progress: 0,
      errors: []
    };
    this.fileInput = React.createRef();
    this.submission = false;
  }
  handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error)=> {
    this.setSate({isUploading: false, errors: {...this.state.errors, error}});
  }
  handleUploadSuccess = (filename) => {
    this.setSate({
      avatar: filename,
      progress: 100,
      isUploading: false
    });
    /// store some stuff here and then get url
  };
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value});
  };
  onSubmit = (e)=> {
    e.preventDefault();
    if(!this.state.username || this.state.username.length < 3){
      this.setState({errors: [...this.state.errors, 'Please provide a Username at least 3 characters long']})
    }

    if(this.state.errors.length!==0 && this.state.password!==''){
      const updatedUser = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2,
        switchID: this.state.switchID,
        avatar: this.state.avatar
      };
      this.props.updateUser(updatedUser, this.props.history);
    }
    if (this.state.errors.length !==0) {
      const updatedUser = {
        username: this.state.username,
        email: this.state.email,
        switchID: this.state.switchID,
        avatar: this.state.avatar
      };
      console.log('hello');
      this.props.updateUser(updatedUser, this.props.history);
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
                  <b>Update</b> Your Account
                </h4>
                <p className="grey-text text-darken-1">
                  Change your mind? <Link to="/dashboard">Go Back</Link>
                </p>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.avatar}
                    error={errors.avatar}
                    id="avatar"
                    type="file"
                    ref={this.fileInput}
                    className={classnames("", {
                    invalid: errors.avatar
                  })}
                  />
                  <label htmlFor="name">Image Upload</label>
                  <span className="red-text">{errors.username}</span>
                </div>
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
                  <span className="red-text">{errors.username}</span>
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
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.switchID}
                    error={errors.switchID}
                    id="switchID"
                    type="text"
                    className={classnames("", {
                    invalid: errors.switchID
                  })}
                  />
                  <label htmlFor="password2">Switch ID</label>
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
                    Update
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
Update.propTypes = {
  updateUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}
const mapStateToProps = (state)=> ({
  auth: state.auth,
  user: state.auth.user,
  errors: state.errors
})

export default connect(mapStateToProps, { updateUser })(withRouter(Update));
