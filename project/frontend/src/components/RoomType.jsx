import React, { Component } from "react";
import key from "weak-key";
import moment from "moment";
import { withRouter } from "react-router-dom";

import Calendar from "./Calendar";
import getCSRFToken from "../lib/getCSRFToken";

import InventoryUpdate from "./InventoryUpdate";
import ReservationCreate from "./ReservationCreate";
import Content from "./Content";
import Loading from "./Loading";
import LoadingError from "./LoadingError";

class RoomType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      model: {},
      inventory: [],
      loaded: false,
      error: false,
      total: 0
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const [model, inventory] = await Promise.all([
      this.loadModel(),
      this.loadInventory()
    ]);

    return this.setState({
      loaded: true
    });
  }

  async loadModel() {
    const response = await fetch(
      `/api/room-types/${this.props.match.params.room_type_id}`
    );

    if (response.status !== 200) {
      return this.setState({
        error: "Something went wrong"
      });
    }

    const data = await response.json();

    return this.setState({
      model: data
    });
  }

  async loadInventory() {
    const response = await fetch(
      `/api/inventory/${this.props.match.params.room_type_id}`
    );

    if (response.status !== 200) {
      return this.setState({
        error: "Something went wrong"
      });
    }

    const data = await response.json();

    return this.setState({
      inventory: data.results
    });
  }

  render() {
    const { model, inventory, loaded, error } = this.state;

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

    const heading = `Room Type: ${model.name}`;

    return (
      <Content heading={heading}>
        <Calendar inventory={inventory} />
        <div className="columns">
          <div className="column">
            <ReservationCreate
              roomType={model}
              onSubmitSuccess={reservation =>
                this.props.history.push(`/reservations/${reservation.id}`)
              }
            />
          </div>
          <div className="column is-one-quarter side-form">
            <InventoryUpdate
              roomType={model}
              onSubmitSuccess={() => this.loadInventory()}
            />
          </div>
        </div>
      </Content>
    );
  }
}

export default withRouter(RoomType);
