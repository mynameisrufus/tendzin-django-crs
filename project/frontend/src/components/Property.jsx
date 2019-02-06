import React, { Component } from "react";
import { Link } from "react-router-dom";

import RoomTypeCreate from "./RoomTypeCreate";
import Content from "./Content";
import Loading from "./Loading";
import LoadingError from "./LoadingError";

const defaultState = {
  model: {},
  loaded: false,
  error: false
};

class Property extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const response = await fetch(
      `/api/properties/${this.props.match.params.property_id}`
    );

    if (response.status !== 200) {
      return this.setState({
        error: "Something went wrong"
      });
    }

    const data = await response.json();

    return this.setState({
      model: data,
      loaded: true
    });
  }

  render() {
    const { model, loaded, error } = this.state;

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

    if (!model.room_types.length) {
      return (
        <Content heading={this.heading}>
          <div className="columns">
            <div className="column">
              <p>No room types</p>
            </div>
            <div className="column is-one-quarter side-form">
              <RoomTypeCreate
                property={model}
                onSubmitSuccess={() => this.load()}
              />
            </div>
          </div>
        </Content>
      );
    }

    const heading = `Property: ${model.name}`;

    return (
      <Content heading={heading}>
        <div className="columns">
          <div className="column">
            <table className="table is-striped">
              <thead>
                <tr>
                  <th>Room Types</th>
                </tr>
              </thead>
              <tbody>
                {model.room_types.map(roomType => (
                  <tr key={roomType.id}>
                    <td>
                      <Link to={`/room-types/${roomType.id}`}>
                        {roomType.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="column is-one-quarter side-form">
            <RoomTypeCreate
              property={model}
              onSubmitSuccess={() => this.load()}
            />
          </div>
        </div>
      </Content>
    );
  }
}

export default Property;
