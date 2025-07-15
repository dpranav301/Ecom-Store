import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getSingleProductDetailService } from "../../Services/productService";
import { toast } from "react-toastify";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { BASE_URL } from "../../Services/helperService";
import defaultProduct from "../../asset/NoImage.png";
import CartContext from "../../context/cartContext";
import UserContext from "../../context/userContext";
const ProductView = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addItemToCart } = useContext(CartContext);
  const { login } = useContext(UserContext);
  // const[productToAddInCart,setProductToAddInCart]=useState(null);
  const addProductToCart = (productId) => {
    addItemToCart(productId, 1, () => {
      toast.success("Product Is Added To Cart");
    }); //This Will Add Product To Cart
    // console.log(
    //   "Add Items To Product Function Call with product id",
    //   productId
    // );
  };
  useEffect(() => {
    loadProductDetails();
  }, []);
  const loadProductDetails = async () => {
    try {
      const data = await getSingleProductDetailService(productId);
      setProduct(data);
      console.log("Single Product ", data);
    } catch (error) {
      toast.error("Something Went Wrong While Loading Product");
      return;
    }
  };
  const productImgUrl = product?.productImage
    ? `${BASE_URL}/products/image/${product.productId}`
    : defaultProduct;
  const designOfProductView = () => {
    return (
      <Container className="mt-4">
        <Card className="shadow rounded">
          <Row noGutters>
            <Col md={5}>
              <img
                src={productImgUrl}
                alt={product.title}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                  // borderTopLeftRadius: "0.5rem",
                  // borderBottomLeftRadius: "0.5rem",
                }}
              />
            </Col>
            <Col md={7}>
              <Card.Body>
                <h3 className="fw-bold">{product.title}</h3>
                <p className="text-muted mb-2">{product.category.title}</p>

                <div className="mb-3">
                  <span className="text-success h5 me-2">
                    ₹{product.discountedPrice || product.price}
                  </span>
                  {product.discountedPrice > 0 && (
                    <span className="text-muted text-decoration-line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                <p>{product.description}</p>

                <div className="mb-2">
                  {product.stock ? (
                    <Badge bg="success">In Stock</Badge>
                  ) : (
                    <Badge bg="danger">Out of Stock</Badge>
                  )}{" "}
                  {product.live && <Badge bg="info">Live</Badge>}
                </div>

                <p className="text-muted small mt-3">
                  Created on: {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <Button
                  variant="success"
                  // title={!product.stock ? "As Product Is Out Of Stock" : "Add To Cart"}
                  disabled={!product.stock}
                  onClick={(event) => addProductToCart(product.productId)}
                >
                  Add To Cart
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    );
  };
  return product && designOfProductView();
};

export default ProductView;
