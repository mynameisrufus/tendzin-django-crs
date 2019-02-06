import React, { Component } from "react";
import key from "weak-key";

const SubmitErrors = ({ errors, onClose }) => (
  <article className="message is-danger">
    <div className="message-header">
      <p>Danger</p>
      <button className="delete" aria-label="delete" onClick={onClose} />
    </div>
    <div className="message-body">
      {errors.map(x => (
        <p key={key(x)}>{x.message}</p>
      ))}
    </div>
  </article>
);

export default SubmitErrors;
