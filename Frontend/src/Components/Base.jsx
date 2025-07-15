import React from "react";
import Container from "react-bootstrap/esm/Container";
import Footer from "./Footer";
import { toast } from "react-toastify";

const Base = ({
  title = "/",
  description = "Welcome To Dynamic store",
  buttonEnabled = false,
  buttonColour = "btn-warning",
  children,
}) => {
  function alertCall() {
    toast.success("You Click Me !!");
  }
  let styleObj = {
    height: "100px",
  };
  return (
    <div>
      <Container
        fluid
        className="d-flex align-items-center justify-content-center  bg-primary text-white text-center"
        style={styleObj}
      >
        <div>
          <h3 className="text-center">{title}</h3>
          <p className="text-center">{description && description}</p>
          {buttonEnabled && (
            <button className={"btn " + buttonColour} onClick={alertCall}>
              Click To Get Best Deals
            </button>
          )}
        </div>
      </Container>
      {children}
      <Footer />
    </div>
  );
};

export default Base;
