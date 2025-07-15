import React from "react";
import { Card, Button, Ratio } from "react-bootstrap";
import { BASE_URL } from "../Services/helperService";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4">
      {/* Maintain image aspect ratio and center the image */}
      <Ratio aspectRatio="4x3" className="bg-white">
        <Card.Img
          variant="top"
          src={`${BASE_URL}/products/image/${product.productId}`}
          alt={product.title}
          className="p-3 object-fit-contain"
        />
      </Ratio>

      <Card.Body className="text-center d-flex flex-column px-3 pt-2 pb-3">
        <Card.Title className="fw-semibold fs-5 mb-2">
          {product.title}
        </Card.Title>
        <Card.Text className="text-muted mb-3">₹{product.price}</Card.Text>

        <Button
          variant="outline-dark"
          className="rounded-pill mt-auto px-4 py-2"
          as={Link}
          to={`/store/product/${product.productId}`}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
