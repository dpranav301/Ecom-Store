import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
      
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.8), rgba(168,85,247,0.8))',
          color: 'white',
          padding: '100px 0',
          textAlign: 'center'
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold">About E-Com</h1>
          <p className="lead mt-3">
            Your trusted online shopping destination for quality and convenience.
          </p>
        </Container>
      </div>

      {/* Our Story Section */}
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80"
              alt="Our Story"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <h2 className="mb-4">Our Story</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.

            </p>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <div className="bg-dark text-white py-4 text-center">
        <Container>
          <p className="mb-0">&copy; {new Date().getFullYear()} E-Com. All rights reserved.</p>
        </Container>
      </div>
    </div>
  );
};

export default AboutPage;

