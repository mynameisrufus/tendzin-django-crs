import React, { Component } from "react";
import moment from "moment";
import key from "weak-key";

import getCalendarGrid from "../lib/getCalendarGrid";

const Day = ({ day, inventory }) => {
  let amounts = {
    count: 0,
    total: 0
  };

  if (!day) {
    return <div className="datepicker-date" />;
  }

  const inventoryForDay = inventory.find(({ range_lower, range_upper }) =>
    day.isBetween(range_lower, range_upper, "day", "[]")
  );

  if (inventoryForDay) {
    amounts = {
      count: inventoryForDay.count,
      total: inventoryForDay.total
    };
  }

  return (
    <div className="datepicker-date">
      <div className="datepicker-day">{day.format("D")}</div>
      <div className="datepicker-totals">
        <span title="number or room nights used">{amounts.count}</span> /
        <span title="total room nights">{amounts.total}</span>
      </div>
    </div>
  );
};

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0
    };
  }

  next() {
    this.setState({ offset: this.state.offset + 1 });
  }

  previous() {
    if (this.state.offset === 0) {
      return;
    }

    this.setState({ offset: this.state.offset - 1 });
  }

  render() {
    const months = getCalendarGrid(moment(), 2, this.state.offset);

    const dows = ["Su", "Mo", "Tu", "We", "Th", "Fr"];

    return (
      <div className="datepicker">
        <div className="datepicker-months">
          {months.map((month, i) => (
            <div key={i} className="datepicker-month">
              <div className="datepicker-nav">
                {i == 0 && (
                  <a
                    className="button is-small"
                    onClick={() => this.previous()}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-angle-left" />
                    </span>
                  </a>
                )}
                <div className="datepicker-nav-date">
                  {month.date.format("MMMM YYYY")}
                </div>
                {i == 1 && (
                  <a className="button is-small" onClick={() => this.next()}>
                    <span className="icon is-small">
                      <i className="fas fa-angle-right" />
                    </span>
                  </a>
                )}
              </div>
              <div className="datepicker-days">
                {dows.map(dow => (
                  <div key={dow} className="datepicker-date">
                    <div className="datepicker-dow">{dow}</div>
                  </div>
                ))}
              </div>
              {month.weeks.map(week => (
                <div key={key(week)} className="datepicker-days">
                  {week.map(day => (
                    <Day
                      key={key({ day })}
                      day={day}
                      inventory={this.props.inventory}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Calendar;
