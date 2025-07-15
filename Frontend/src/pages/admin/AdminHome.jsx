import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div>
      <Row>
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3>Welcome To Admin Dashboard</h3>
              <p>
                This Dashboard Let's Admin to Manage All The
                Products,Orders,Users etc
              </p>

              <Container className="mt-4">
                <Row className="mb-3 gx-3 gy-3">
                  <Col md={4}>
                    <Button
                      variant="primary"
                      as={Link}
                      to="/admin/add-category"
                      className="w-100"
                    >
                      Add Category
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="success"
                      as={Link}
                      to="/admin/categories"
                      className="w-100"
                    >
                      Manage Categories
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="warning"
                      as={Link}
                      to="/admin/addProduct"
                      className="w-100"
                    >
                      Add Products
                    </Button>
                  </Col>
                </Row>
                <Row className="gx-3 gy-3">
                  <Col md={4}>
                    <Button
                      variant="danger"
                      as={Link}
                      to="/admin/products"
                      className="w-100"
                    >
                      Manage Products
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="info"
                      as={Link}
                      to="/admin/orders"
                      className="w-100"
                    >
                      View Orders
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="dark"
                      as={Link}
                      to="/admin/users"
                      className="w-100"
                    >
                      View Users
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;
