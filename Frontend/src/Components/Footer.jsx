import React from "react";
import Container from "react-bootstrap/esm/Container";

const Footer = () => {
  let styleComponent = {
    height: "100px",
  };
  return (
    <Container
      fluid
      className="bg-dark p-5 text-white d-flex justify-content-center align-items-center"
      style={styleComponent}
    >
      <div>
        <h1>We Provide Best Product</h1>
        <p>All Rights Reserved</p>
      </div>
    </Container>
  );
};

export default Footer;
