import React, { Component } from "react";
import { Link } from "react-router-dom";

import bookingShortCode from "../lib/bookingShortCode";

import Content from "./Content";
import Loading from "./Loading";
import LoadingError from "./LoadingError";

const defaultState = {
  results: [],
  loaded: false,
  error: false
};

class Reservations extends Component {
  constructor(props) {
    super(props);
    this.heading = "Reservations";
    this.state = Object.assign({}, defaultState);
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const response = await fetch("/api/reservations");

    if (response.status !== 200) {
      return this.setState({
        error: "Something went wrong"
      });
    }

    const data = await response.json();

    return this.setState({
      results: data.results,
      loaded: true
    });
  }

  render() {
    const { results, loaded, error } = this.state;

    if (error) {
      <Content>
        <LoadingError />
      </Content>;
    }

    if (!loaded) {
      return (
        <Content>
          <Loading />
        </Content>
      );
    }

    if (!results.length) {
      return (
        <Content heading={this.heading}>
          <p>No reservations</p>
        </Content>
      );
    }

    return (
      <Content heading={this.heading}>
        <table className="table is-striped">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Booking Name</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Property</th>
              <th>Room Type</th>
            </tr>
          </thead>
          <tbody>
            {results.map(reservation => (
              <tr key={reservation.id}>
                <td>
                  <Link to={`/reservations/${reservation.id}`}>
                    {bookingShortCode(reservation)}
                  </Link>
                </td>
                <td>
                  {reservation.booking_first_name}{" "}
                  {reservation.booking_last_name}
                </td>
                <td>{reservation.check_in}</td>
                <td>{reservation.check_out}</td>
                <td>{reservation.status}</td>
                <td>
                  <Link to={`/properties/${reservation.room_type.property.id}`}>
                    {reservation.room_type.property.name}
                  </Link>
                </td>
                <td>
                  <Link to={`/room-types/${reservation.room_type.id}`}>
                    {reservation.room_type.name}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Content>
    );
  }
}

export default Reservations;
