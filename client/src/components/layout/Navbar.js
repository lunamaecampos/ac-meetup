import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render(){
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper">
            <Link
              to="/"
              style={{ fontFamily: "monospace"}}
              className = "col s5 brand-logo center black-text"
            >
              <i className="Material-icons">nook's</i>
              Cranny n Turnip Exchange
            </Link>
          </div>
        </nav>
      </div>
    )
  }
}
export default Navbar;
