// NotFound.js
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center bg-light"
    >
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-lg p-4 animate__animated animate__fadeIn">
            <Card.Body>
              <h1 className="display-1 text-primary fw-bold">404</h1>
              <h4 className="mb-3">Page Not Found</h4>
              <p className="text-muted mb-4">
                Sorry, the page you're looking for doesn't exist or was moved.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill"
                onClick={() => navigate("/")}
              >
                Go to Homepage
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
