// src/components/Loader.js
import React from "react";
import { Container } from "react-bootstrap";
import "../Styles/Loader.css"; // Custom CSS for animations

const Loader = ({ show }) => {
  return (
    show && (
      <div className="custom-loader-overlay">
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <div className="loader-circle">
            <div className="pulse"></div>
            <div className="pulse"></div>
            <div className="pulse"></div>
          </div>
          <div className="text-white fs-5 mt-4 ms-3">
            Loading, please wait...
          </div>
        </Container>
      </div>
    )
  );
};

export default Loader;
