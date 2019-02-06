import React, { Component } from "react";
import moment from "moment";

import getCSRFToken from "../lib/getCSRFToken";

import SubmitErrors from "./SubmitErrors";

const defaultState = {
  errors: [],
  total: 0,
  range: {
    upper: moment()
      .add(1, "day")
      .format("YYYY-MM-DD"),
    lower: moment().format("YYYY-MM-DD")
  }
};

class InventoryUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
    this.handleLowerRangeChange = this.handleLowerRangeChange.bind(this);
    this.handleUpperRangeChange = this.handleUpperRangeChange.bind(this);
    this.handleTotalChange = this.handleTotalChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLowerRangeChange(event) {
    this.setState({
      range: {
        lower: event.target.value,
        upper: this.state.range.upper
      }
    });
  }

  handleUpperRangeChange(event) {
    this.setState({
      range: {
        lower: this.state.range.lower,
        upper: event.target.value
      }
    });
  }

  handleTotalChange(event) {
    this.setState({
      total: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const {
      total,
      range: { upper, lower }
    } = this.state;

    const { roomType } = this.props;

    const response = await fetch(`/api/inventory/${roomType.id}`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken()
      },
      body: JSON.stringify({
        total,
        range_upper: upper,
        range_lower: lower
      })
    });

    if (response.status !== 204) {
      const data = await response.json();
      return this.setState({ errors: data.errors });
    }

    this.props.onSubmitSuccess();
  }

  render() {
    const { errors } = this.state;

    return (
      <div>
        <h3>Update Inventory</h3>
        {errors.length > 0 && (
          <SubmitErrors
            errors={errors}
            onClose={() => this.setState({ errors: [] })}
          />
        )}
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <div className="control">
              <label className="label">From</label>
              <input
                className="input"
                type="date"
                value={this.state.range.lower}
                onChange={this.handleLowerRangeChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="label">To</label>
              <input
                className="input"
                type="date"
                value={this.state.range.upper}
                onChange={this.handleUpperRangeChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="label">Total</label>
              <input
                className="input"
                type="number"
                value={this.state.total}
                onChange={this.handleTotalChange}
              />
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

export default InventoryUpdate;
