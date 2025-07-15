import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap"; // Import Container
import ProductCard from "../Components/ProductCard";
import ShoppingCartImg from "../asset/ShoppingCart.jpg";
import { Link } from "react-router-dom";
import { fetchAllProduct } from "../Services/productService";
import { toast } from "react-toastify";
const Home = () => {
  const [product, setProduct] = useState(null);

  const loadAllProduct = async () => {
    try {
      let data = await fetchAllProduct(0, 6);
      console.log("Product In Index Page ", data);
      setProduct(data);
    } catch (error) {
      toast.error("Something Went Wrong While Fetching The Products");
    }
  };

  useEffect(() => {
    loadAllProduct();
  }, []);
  const Header = () => (
    <Navbar bg="light" expand="lg" className="py-3">
      {" "}
      {/* bg="light" or "white", py-3 for vertical padding */}
      <Container>
        <Navbar.Brand href="#home" className="fw-bold fs-3">
          YourBrand
        </Navbar.Brand>{" "}
        {/* fw-bold for font-weight, fs-3 for font-size */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {" "}
            {/* ms-auto pushes items to the right */}
            <Nav.Link href="#shop" className="me-3">
              Shop
            </Nav.Link>{" "}
            {/* me-3 for right margin */}
            <Nav.Link href="#cart">
              🛒 <span className="badge bg-secondary ms-1">0</span>
            </Nav.Link>{" "}
            {/* Badge for cart count */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  const heroSection = () => (
    <section className="hero-section bg-light text-center py-5">
      {" "}
      {/* Add custom class for background/height */}
      <Container>
        <Row className="align-items-center justify-content-center py-5">
          {" "}
          {/* py-5 for vertical spacing */}
          <Col md={7} className="text-md-start">
            {" "}
            {/* text-md-start for left-align on medium screens up */}
            <h1 className="display-4 fw-bold mb-3">
              Your Brand - Simple & Elegant Products
            </h1>{" "}
            {/* display-4 for large heading, fw-bold for bold */}
            <p className="lead mb-4">
              Discover minimalist designs for your everyday life.
            </p>{" "}
            {/* lead for slightly larger text */}
            <Button
              variant="dark"
              size="lg"
              className="rounded-pill px-4 py-2"
              as={Link}
              to={"/store"}
            >
              Shop Now
            </Button>{" "}
            {/* dark variant, large size, pill shape */}
          </Col>
          <Col md={5} className="mt-4 mt-md-0">
            {" "}
            {/* mt-4 for top margin on small screens, mt-md-0 removes it on medium */}
            {/* Replace with your high-quality hero image */}
            <img
              src={ShoppingCartImg} // Placeholder image
              alt="Minimalist Product"
              className="img-fluid rounded shadow-sm" // img-fluid for responsiveness, rounded for subtle corners, shadow-sm for subtle shadow
            />
          </Col>
        </Row>
      </Container>
    </section>
  );

  const productShowcase = () => (
    <section className="product-showcase py-5 bg-white">
      <Container>
        <h2 className="text-center mb-5 fw-bold">Our Latest Collection</h2>
        <Row xs={1} md={2} lg={3} className="g-4 mb-4">
          {/* Responsive grid: 1 col on xs, 2 on md, 3 on lg. g-4 for gutter spacing */}
          {product &&
            product.content.map((prod) => (
              <Col key={prod.productId}>
                <ProductCard product={prod} />
              </Col>
            ))}
        </Row>
        <div className="text-center">
          <Button
            variant="outline-dark"
            size="lg"
            className="rounded-pill px-4 py-2"
            as={Link}
            to={"/store"}
          >
            View All Products
          </Button>
        </div>
      </Container>
    </section>
  );

  const callToAction = () => (
    <section className="call-to-action bg-dark text-white py-5 text-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="mb-3 fw-bold">
              Ready to Elevate Your Shopping Experience
            </h2>
            <p className="lead mb-4">
              Sign up for to get exclusive offers and updates.
            </p>
            <Form className="d-flex justify-content-center">
              <Button
                variant="light"
                type="submit"
                className="rounded-pill px-4"
                as={Link}
                to={"/register"}
              >
                Sign Up
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const footer = () => (
    <footer className="footer bg-light text-muted py-4">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            {" "}
            {/* text-center on small, text-md-start on medium up */}
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Your Brand. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <a href="/privacy" className="text-muted text-decoration-none me-3">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted text-decoration-none">
              Terms of Service
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
  return (
    // Use Container for a responsive fixed-width or fluid layout
    <Container fluid className="p-0">
      {/* {Header()} */}
      {heroSection()}
      {productShowcase()}
      {callToAction()}
      {footer()}
      {/* Use fluid for full width, p-0 to remove default padding */}
    </Container>
  );
};
export default Home;
