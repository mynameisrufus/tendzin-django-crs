import React from "react";

const Content = ({ children, heading }) => (
  <section className="section">
    <div className="content">
      {heading && <h1>{heading}</h1>}
      {children}
    </div>
  </section>
);

export default Content;
