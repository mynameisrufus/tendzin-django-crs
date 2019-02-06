import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Brand from "./Brand";
import Reservations from "./Reservations";
import Reservation from "./Reservation";
import Properties from "./Properties";
import Property from "./Property";
import RoomType from "./RoomType";

const App = () => (
  <Router>
    <div>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <Brand />
          </Link>

          <a
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
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
      <Route path="/" exact component={Reservations} />
      <Route path="/reservations" exact component={Reservations} />
      <Route
        path="/reservations/:reservation_id"
        exact
        component={Reservation}
      />
      <Route path="/properties" exact component={Properties} />
      <Route path="/properties/:property_id" exact component={Property} />
      <Route path="/room-types/:room_type_id" exact component={RoomType} />
    </div>
  </Router>
);

export default App;
