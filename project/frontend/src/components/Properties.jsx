import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropertyCreate from "./PropertyCreate";
import Content from "./Content";
import Loading from "./Loading";
import LoadingError from "./LoadingError";

const defaultState = {
  results: [],
  loaded: false,
  error: false
};

class Properties extends Component {
  constructor(props) {
    super(props);
    this.heading = "Properties";
    this.state = Object.assign({}, defaultState);
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const response = await fetch("/api/properties");

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
          <div className="columns">
            <div className="column">
              <p>No properties</p>
            </div>
            <div className="column is-one-quarter side-form">
              <PropertyCreate onSubmitSuccess={() => this.load()} />
            </div>
          </div>
        </Content>
      );
    }

    return (
      <Content heading={this.heading}>
        <div className="columns">
          <div className="column">
            <table className="table is-striped">
              <tbody>
                {results.map(property => (
                  <tr key={property.id}>
                    <td>
                      <Link to={`/properties/${property.id}`}>
                        {property.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="column is-one-quarter side-form">
            <PropertyCreate onSubmitSuccess={() => this.load()} />
          </div>
        </div>
      </Content>
    );
  }
}

export default Properties;
