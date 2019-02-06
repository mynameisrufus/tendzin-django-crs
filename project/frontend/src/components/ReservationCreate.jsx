import React, { Component } from "react";

import getCSRFToken from "../lib/getCSRFToken";
import djangoErrors from "../lib/djangoErrors";

import SubmitErrors from "./SubmitErrors";

const defaultState = {
  errors: [],
  reservation: {
    number_of_adults: 1,
    number_of_children: 0,
    number_of_infants: 0
  }
};

export const fields = [
  {
    type: "date",
    label: "Check in date",
    name: "check_in",
    align: "left"
  },
  {
    type: "number",
    label: "Number of nights",
    name: "number_of_nights",
    align: "left"
  },
  {
    min: 1,
    type: "number",
    label: "Adults",
    name: "number_of_adults",
    align: "left"
  },
  {
    type: "number",
    label: "Children",
    name: "number_of_children",
    align: "left"
  },
  {
    type: "number",
    label: "Infants",
    name: "number_of_infants",
    align: "left"
  },
  {
    type: "text",
    label: "First name",
    name: "booking_first_name",
    align: "right"
  },
  {
    type: "text",
    label: "Last name",
    name: "booking_last_name",
    align: "right"
  },
  {
    type: "email",
    label: "Email",
    name: "booking_email",
    align: "right"
  },
  {
    type: "phone",
    label: "Phone",
    name: "booking_phone",
    align: "right"
  }
];

const fieldsLeft = fields.filter(({ align }) => align === "left");
const fieldsRight = fields.filter(({ align }) => align === "right");

class ReservationCreate extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
    this.handleUpdateName = this.handleUpdate.bind(this);
    this.handleUpdateSpecialRequests = this.handleUpdateSpecialRequests.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUpdate(event, name) {
    const reservation = Object.assign({}, this.state.reservation);
    reservation[name] = event.target.value;
    this.setState({ reservation });
  }

  handleUpdateSpecialRequests(event) {
    const reservation = Object.assign({}, this.state.reservation);
    reservation.special_requests = event.target.value;
    this.setState({ reservation });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const { reservation } = this.state;

    const { roomType } = this.props;

    const response = await fetch(`/api/reservations`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken()
      },
      body: JSON.stringify(
        Object.assign(
          {
            room_type: roomType.id
          },
          reservation
        )
      )
    });

    const data = await response.json();

    if (response.status !== 201) {
      return this.setState({ errors: djangoErrors(data) });
    }

    this.setState(defaultState);
    this.props.onSubmitSuccess(data);
  }

  render() {
    const { errors, reservation } = this.state;

    return (
      <div>
        <h3>Create Reservation</h3>
        {errors.length > 0 && (
          <SubmitErrors
            errors={errors}
            onClose={() => this.setState({ errors: [] })}
          />
        )}
        <form onSubmit={this.handleSubmit}>
          <div className="columns">
            <div className="column">
              {fieldsLeft.map(({ type, label, name, min }) => (
                <div key={name} className="field">
                  <label className="label">{label}</label>
                  <div className="control">
                    <input
                      min={min || 0}
                      className="input"
                      type={type}
                      value={reservation[name]}
                      onChange={event => this.handleUpdate(event, name)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="column">
              {fieldsRight.map(({ type, label, name, min }) => (
                <div key={name} className="field">
                  <label className="label">{label}</label>
                  <div className="control">
                    <input
                      min={min || 0}
                      className="input"
                      type={type}
                      onChange={event => this.handleUpdate(event, name)}
                    />
                  </div>
                </div>
              ))}
              <div className="field">
                <div className="control">
                  <label className="label">Special Requests</label>
                  <textarea
                    rows="1"
                    className="textarea is-primary"
                    placeholder="Special request"
                    onChange={this.handleUpdateSpecialRequests}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="button is-primary"
                type="submit"
                value="Submit"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ReservationCreate;
