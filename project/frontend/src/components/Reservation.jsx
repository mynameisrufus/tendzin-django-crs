import React, { Component } from "react";
import { Link } from "react-router-dom";

import getCSRFToken from "../lib/getCSRFToken";
import bookingShortCode from "../lib/bookingShortCode";

import { fields } from "./ReservationCreate";
import Content from "./Content";
import Loading from "./Loading";
import LoadingError from "./LoadingError";

const defaultState = {
  reservation: {},
  loaded: false,
  error: false
};

const Detail = ({ reservation, field }) => {
  if (field.type === "date") {
    return (
      <dl>
        <dt>
          <strong>{field.label}</strong>
        </dt>
        <dd>
          <time dateTime={reservation[field.name]}>
            {reservation[field.name]}
          </time>
        </dd>
      </dl>
    );
  }

  if (field.type === "email") {
    return (
      <dl>
        <dt>
          <strong>{field.label}</strong>
        </dt>
        <dd>
          <a href={"mailto:" + reservation[field.name]}>
            {reservation[field.name]}
          </a>
        </dd>
      </dl>
    );
  }

  if (field.type === "phone") {
    return (
      <dl>
        <dt>
          <strong>{field.label}</strong>
        </dt>
        <dd>
          <a href={"tel:" + reservation[field.name]}>
            {reservation[field.name]}
          </a>
        </dd>
      </dl>
    );
  }

  return (
    <dl>
      <dt>
        <strong>{field.label}</strong>
      </dt>
      <dd>{reservation[field.name]}</dd>
    </dl>
  );
};

class Reservation extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const response = await fetch(
      `/api/reservations/${this.props.match.params.reservation_id}`
    );

    if (response.status !== 200) {
      return this.setState({
        error: "Something went wrong"
      });
    }

    const data = await response.json();

    return this.setState({
      reservation: data,
      loaded: true
    });
  }

  async cancel() {
    const response = await fetch(
      `/api/reservations/${this.props.match.params.reservation_id}`,
      {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken()
        }
      }
    );

    if (response.status !== 204) {
      window.alert("Could not delete reservation");
    }

    return this.load();
  }

  render() {
    const { reservation, loaded, error } = this.state;

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

    const heading = `Reservation: ${bookingShortCode(reservation)} (${
      reservation.status
    })`;

    const cancelConfirmation = `Are you sure you want to delete reservation ${bookingShortCode(
      reservation
    )}?`;

    return (
      <Content heading={heading}>
        <div className="card">
          <div className="card-content">
            <dl>
              <dt>
                <strong>Property</strong>
              </dt>
              <dd>
                <Link to={`/properties/${reservation.room_type.property.id}`}>
                  {reservation.room_type.property.name}
                </Link>
              </dd>
              <dt>
                <strong>Room Type</strong>
              </dt>
              <dd>
                <Link to={`/room-types/${reservation.room_type.id}`}>
                  {reservation.room_type.name}
                </Link>
              </dd>
            </dl>
            {fields.map(field => (
              <Detail
                key={field.name}
                field={field}
                reservation={reservation}
              />
            ))}
            {reservation.status !== "cancelled" && (
              <button
                className="button is-danger"
                onClick={() => {
                  if (window.confirm(cancelConfirmation)) this.cancel();
                }}
              >
                Cancel Reservation
              </button>
            )}
          </div>
        </div>
      </Content>
    );
  }
}

export default Reservation;
