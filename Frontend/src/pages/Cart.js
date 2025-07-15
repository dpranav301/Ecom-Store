import React, { useContext, useEffect, useState } from "react";
import CartContext from "../context/cartContext";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import SingleCartItemView from "../Components/User/SingleCartItemView";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrderService } from "../Services/orderService";
import Swal from "sweetalert2";
const Cart = () => {
  const { cart, addItemToCart, removeItemFromCart, getCartOfUserInitially } =
    useContext(CartContext); // correctly get the `cart` object
  const [orderPlacedClick, setOrderPlacedClick] = useState(false);
  const [initialCart, setInitialCart] = useState(cart);

  useEffect(() => {
    setInitialCart(cart);
  }, [cart]);
  const [billingForm, setBillingForm] = useState({
    billingAddress: null,
    billingName: null,
    billingPhone: null,
    paymentStatus: false,
    orderStatus: "PENDING",
  });
  // Defensive checks
  if (!initialCart || !initialCart.cartItem) {
    return (
      <Container className="mt-2">
        <Card className="text-center">
          <Card.Body>
            <h1>Loading cart...</h1>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const { cartId, cartItem } = initialCart;

  console.log("CartItem Inside ", cartItem);
  console.log("CartId: ", cartId);

  const noItemsPresentInCart = () => (
    <Container className="mt-2">
      <Alert variant="danger" className="shadow-sm text-center fw-bold">
        <h3>No Items Are Present In The Cart</h3>
        <Button
          variant="info"
          size="lg"
          className="mt-3"
          as={Link}
          to={"/store"}
        >
          Start Shopping
        </Button>
      </Alert>
    </Container>
  );

  const submitPlaceOrderForm = async (event) => {
    event.preventDefault();

    if (
      billingForm.billingName === null ||
      billingForm.billingName === undefined ||
      billingForm.billingName.trim() === ""
    ) {
      toast.error("Name Is Required");
      return;
    }

    if (
      billingForm.billingAddress === null ||
      billingForm.billingAddress === undefined ||
      billingForm.billingAddress.trim() === ""
    ) {
      toast.error("Address Is Required");
      return;
    }

    if (
      billingForm.billingPhone === null ||
      billingForm.billingPhone === undefined ||
      billingForm.billingPhone.trim() === ""
    ) {
      toast.error("Phone No Is Required");
      return;
    }

    console.log("BillingForm ", billingForm);

    try {
      let result = await createOrderService(
        initialCart.user.userId,
        billingForm
      );
      console.log("Response From Create Order Service", result);
      getCartOfUserInitially();
      // toast.success("Order Placed Successfully");
      Swal.fire({
        title: "Order Place Successfully",
        text: "Please Click Proceed For Payment Page",
        icon: "success",
      });
    } catch (error) {
      toast.error("Error Occurred While Placing Order");
      console.log("Error While Adding Placing Order", error);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setBillingForm({
      ...billingForm,
      [name]: value,
    });
  };
  const orderPlaceForm = () => {
    return (
      <Form
        onSubmit={submitPlaceOrderForm}
        noValidate
        className="p-3 rounded-4 shadow-sm border border-light bg-light"
      >
        <h5 className="mb-4 fw-semibold text-primary">Billing Information</h5>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Billing Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            className="rounded-3 shadow-sm"
            name="billingName"
            value={billingForm.billingName}
            onChange={handleFormChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Billing Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter Address"
            className="rounded-3 shadow-sm"
            name="billingAddress"
            value={billingForm.billingAddress}
            onChange={handleFormChange}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Billing Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter Phone Number"
            className="rounded-3 shadow-sm"
            pattern="[0-9]*"
            maxLength={10}
            required
            name="billingPhone"
            value={billingForm.billingPhone ?? ""}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              handleFormChange({
                target: {
                  name: "billingPhone",
                  value: numericValue,
                },
              });
            }}
          />
        </Form.Group>

        <div className="text-end">
          <Button type="submit" variant="primary" className="rounded-pill px-4">
            Click Here To Confirm Order
          </Button>
        </div>
      </Form>
    );
  };
  const cartItemView = () => {
    return (
      <>
        {/* Header Info */}
        <Card className="mb-4 p-3 shadow-sm rounded-4 border-0 bg-light">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                🛒 Cart of:{" "}
                <span className="fw-semibold">{initialCart.user.name}</span>
              </h5>
            </Col>
            <Col className="text-end">
              <span className="fw-semibold">
                Total Items: {initialCart.cartItem.length}
              </span>
            </Col>
          </Row>
        </Card>

        <Row>
          <Col>
            {/* Cart Items */}
            {cartItem.map((item, index) => (
              <SingleCartItemView
                item={item}
                index={index}
                addItemToCart={addItemToCart}
                removeItemFromCart={removeItemFromCart}
              />
            ))}
          </Col>
          {orderPlacedClick && <Col>{orderPlaceForm()}</Col>}
        </Row>

        {/* Total Price Section */}
        <Card className="p-3 mt-4 shadow-sm rounded-4 border-0 bg-light">
          <Row className="justify-content-end">
            <Col className="text-center">
              <Button
                size="m"
                variant="success"
                onClick={(event) => {
                  setOrderPlacedClick(true);
                }}
                hidden={orderPlacedClick}
              >
                Place Order
              </Button>
            </Col>
            <Col md="auto">
              <h5 className="fw-semibold mb-0">
                Total Price: ₹
                {initialCart.cartItem.reduce(
                  (total, item) =>
                    total + item.product.discountedPrice * item.quantity,
                  0
                )}
              </h5>
            </Col>
          </Row>
        </Card>
      </>
    );
  };
  return cartItem.length === 0 ? (
    noItemsPresentInCart()
  ) : (
    <Container className="mt-4">{cartItemView()}</Container>
  );
};

export default Cart;
