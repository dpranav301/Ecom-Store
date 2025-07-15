import React, { useContext, useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { BASE_URL } from "../../Services/helperService";
import UserContext from "../../context/userContext";
import { Link } from "react-router-dom";
import CartContext from "../../context/cartContext";
import { toast } from "react-toastify";

const SingleProductCard = ({ product }) => {
  const { login, userData, logoutFun } = useContext(UserContext);
  const { addItemToCart } = useContext(CartContext);
  // const[productToAddInCart,setProductToAddInCart]=useState(null);
  const addProductToCart = (productId) => {
    addItemToCart(productId, 1, () => {
      toast.success("Item is Added To Cart");
    }); //This Will Add Product To Cart
    console.log(
      "Add Items To Product Function Call with product id",
      productId
    );
  };
  return (
    <Card
      className="m-2 shadow-sm border-0"
      style={{
        width: "100%",
        minHeight: "380px",
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
      // border={!product.live ? "outline-danger" : "outline-info"}
    >
      <div
        style={{
          height: "200px",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Card.Img
          variant="top"
          src={`${BASE_URL}/products/image/${product.productId}`}
          alt={product.title}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
        />
      </div>
      <Card.Body>
        <Card.Title
          className="fw-bold text-black text-truncate"
          title={product.title}
        >
          {product.title}
        </Card.Title>
        <Card.Text
          className="text-secondary"
          style={{
            maxHeight: "80px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Price : <s> ₹{product.price}</s>{" "}
          <strong className="text-dark">₹{product.discountedPrice}</strong>
          <br />
          Description : {product.description}
        </Card.Text>
        <Row className="mt-2 mb-2 d-flex justify-content-between">
          <Col>
            <Badge pill backgroundColor="info">
              {product.category.title}
            </Badge>
          </Col>
          <Col>
            <Badge pill bg={product.stock ? "success" : "danger"}>
              {product.stock ? "In Stock" : "Out of Stock"}
            </Badge>
          </Col>
        </Row>
        <Container className="d-flex justify-content-between">
          <Button
            variant="success"
            // title={!product.stock ? "As Product Is Out Of Stock" : "Add To Cart"}
            disabled={!product.stock || !login}
            onClick={(event) => addProductToCart(product.productId)}
          >
            Add To Cart
          </Button>
          <Button
            variant="info"
            // title={!product.stock ? "As Product Is Out Of Stock" : "Add To Cart"}
            as={Link}
            to={`/store/product/${product.productId}`}
          >
            View Product
          </Button>
        </Container>
      </Card.Body>
    </Card>
  );
};

// export default SingleProductCard;

export default SingleProductCard;
