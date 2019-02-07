import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Reservations from "./Reservations";
import Reservation from "./Reservation";
import Properties from "./Properties";
import Property from "./Property";
import RoomType from "./RoomType";

const App = () => (
  <Router>
    <div>
      <Navbar />
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
