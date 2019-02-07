import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Brand from "./Brand";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ open: false });
    }
  }

  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <Brand />
          </Link>

          <a
            role="button"
            className={
              this.state.open
                ? "navbar-burger burger is-active"
                : "navbar-burger burger"
            }
            aria-label="menu"
            aria-expanded="false"
            onClick={() => this.setState({ open: !this.state.open })}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        <div
          className={this.state.open ? "navbar-menu is-active" : "navbar-menu"}
        >
          <div className="navbar-start">
            <Link to="/reservations" className="navbar-item">
              Reservations
            </Link>
            <Link to="/properties" className="navbar-item">
              Properties
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
