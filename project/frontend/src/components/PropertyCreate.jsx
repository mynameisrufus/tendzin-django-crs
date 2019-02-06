import React, { Component } from "react";

import getCSRFToken from "../lib/getCSRFToken";
import djangoErrors from "../lib/djangoErrors";

import SubmitErrors from "./SubmitErrors";

const defaultState = {
  errors: [],
  name: "",
  description: ""
};

class PropertyCreate extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
    this.handleUpdateName = this.handleUpdateName.bind(this);
    this.handleUpdateDesc = this.handleUpdateDesc.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUpdateName(event) {
    this.setState({ name: event.target.value });
  }

  handleUpdateDesc(event) {
    this.setState({ description: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const { name, description } = this.state;

    const response = await fetch(`/api/properties`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken()
      },
      body: JSON.stringify({
        name,
        description
      })
    });

    const data = await response.json();

    if (response.status !== 201) {
      return this.setState({ errors: djangoErrors(data) });
    }

    this.setState(defaultState);
    this.props.onSubmitSuccess(data);
  }

  render() {
    const { name, description, errors } = this.state;

    return (
      <div>
        <h3>Create Property</h3>
        {errors.length > 0 && (
          <SubmitErrors
            errors={errors}
            onClose={() => this.setState({ errors: [] })}
          />
        )}
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <div className="control">
              <label className="label">Name</label>
              <input
                className="input"
                type="text"
                value={name}
                onChange={this.handleUpdateName}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="label">Description</label>
              <textarea
                className="textarea is-primary"
                value={description}
                onChange={this.handleUpdateDesc}
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

export default PropertyCreate;
