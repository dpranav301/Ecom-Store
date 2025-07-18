
// function services() {
//   let style = {
//     backgroundColor: "orange",
//     display: "flex",
//     justifyContent: "center",
//   };
//   return (
//     <Base
//       title={"This Is Service"}
//       buttonEnabled={true}
//       buttonColour={"btn-danger"}
//     >
//       <h1>This is Services Component</h1>
//     </Base>
//   );
// }
// export default services;

// ServicesPage.jsx
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const services = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '100px 0',
          textAlign: 'center',
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold">Our Premium Services</h1>
          <p className="lead mb-4">
            Enhancing your shopping experience with our exceptional services
          </p>
          <Button variant="light" size="lg">
            Explore Services
          </Button>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">How We Serve You</h2>
            <p className="text-muted">
              We offer a range of services designed to make your shopping experience seamless and enjoyable.
            </p>
          </div>

          <Row xs={1} md={2} lg={3} className="g-4">
            {[
              {
                icon: 'fa-truck-fast',
                title: 'Fast & Free Delivery',
                desc: 'Enjoy free delivery on all orders over $50 with our lightning-fast shipping network.',
              },
              {
                icon: 'fa-rotate-left',
                title: 'Easy Returns',
                desc: 'Return any item within 30 days for a full refund, no questions asked.',
              },
              {
                icon: 'fa-headset',
                title: '24/7 Support',
                desc: 'Our support team is always ready to assist you.',
              },
              {
                icon: 'fa-shield-alt',
                title: 'Secure Payments',
                desc: 'Shop confidently with our secure checkout process.',
              },
              {
                icon: 'fa-percent',
                title: 'Exclusive Discounts',
                desc: 'Get access to members-only discounts and sales.',
              },
              {
                icon: 'fa-gift',
                title: 'Gift Services',
                desc: 'Send special gifts with wrapping and personal messages.',
              },
            ].map((service, index) => (
              <Col key={index}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <div className="text-primary mb-3">
                      <i className={`fas ${service.icon} fa-2x`}></i>
                    </div>
                    <Card.Title className="fw-bold">{service.title}</Card.Title>
                    <Card.Text>{service.desc}</Card.Text>
                    {/* <Button variant="link" className="p-0">
                      Learn More <i className="fas fa-arrow-right ms-1"></i>
                    </Button> */}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={4}>
              <h5>E-Com</h5>
              <p>Making online shopping effortless with our premium services.</p>
            </Col>
            <Col md={2}>
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li><a href="/" className="text-white-50">Home</a></li>
                <li><a href="#" className="text-white-50">Services</a></li>
              </ul>
            </Col>
            <Col md={2}>
              <h6>Services</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white-50">Fast Delivery</a></li>
                <li><a href="#" className="text-white-50">Easy Returns</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h6>Contact</h6>
              <p className="text-white-50">123 Shopping Street, Retail City</p>
              <p className="text-white-50">+1 (555) 123-4567</p>
              <p className="text-white-50">support@ecom.com</p>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <div className="text-center text-white-50">
            © {new Date().getFullYear()} E-Com. All rights reserved.
          </div>
        </Container>
      </footer>
    </>
  );
};

export default services;

