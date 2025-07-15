import React, { useContext, useState } from "react";
import {
  Card,
  Button,
  Collapse,
  Badge,
  ListGroup,
  Row,
  Col,
  Image,
  Container,
  Modal,
  Form,
  FormGroup,
} from "react-bootstrap";
import { formattedDate, ORDER_STATUS } from "../../Services/helperService";
import defaultProfile from "../../logo.svg";
import { BASE_URL } from "../../Services/helperService";
import { updateOrderService } from "../../Services/orderService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import UserContext from "../../context/userContext";
const SingleOrderView = ({ orders, orderNo }) => {
  const [order, setOrder] = useState(orders);
  const [show, setShow] = useState(false);
  const [showOfUpdate, setShowOfUpdate] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const cardBg = order.paymentStatus ? "paid" : "unpaid";
  const { userData } = useContext(UserContext);
  const handleShowOfUpdate = () => {
    // console.log("Order is Single " + JSON.stringify(order));
    setShowOfUpdate(true);
    setOrderToUpdate(order);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // console.log(`The name is ${name} and value is ${value}`);
    if (name === "deliveredDate") {
      const now = new Date();

      // Format current time as HH:mm:ss
      const currentTime = now.toTimeString().split(" ")[0]; // "14:42:15"

      // Combine them to create a LocalDateTime string
      const newDeliveredDate = `${value}T${currentTime}`;
      setOrderToUpdate({ ...orderToUpdate, deliveredDate: newDeliveredDate });
    } else {
      setOrderToUpdate({ ...orderToUpdate, [name]: value });
    }
  };
  const handleCloseOfUpdate = () => {
    setShowOfUpdate(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Order Update DTO " + JSON.stringify(orderToUpdate));

    try {
      const result = await updateOrderService(orderToUpdate);
      toast.success("Order Updated Successfully");
      setOrder({ ...order, ...result });
    } catch (error) {
      console.log(error);
      toast.error("Error Occurred While Updating Order");
    }
    handleCloseOfUpdate();
  };
  const showUpdateOrderModal = () => {
    return (
      <>
        <Modal
          show={showOfUpdate}
          onHide={handleCloseOfUpdate}
          centered
          size="lg"
        >
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              <>
                <h4>Update Order</h4>
                <h5>Order Id: {order.orderId}</h5>
              </>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">Billing Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="billingAddress"
                      placeholder={orderToUpdate.billingAddress}
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">Billing Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="billingPhone"
                      placeholder={orderToUpdate.billingPhone}
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">
                      Is Order Payment Done ?
                    </Form.Label>
                    <Form.Switch
                      name="paymentStatus"
                      checked={orderToUpdate.paymentStatus}
                      label="Done"
                      onChange={(event) =>
                        setOrderToUpdate({
                          ...orderToUpdate,
                          paymentStatus: event.target.checked,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">Order Status</Form.Label>
                    <Form.Select
                      value={orderToUpdate.orderStatus}
                      name="orderStatus"
                      onChange={handleChange}
                    >
                      {ORDER_STATUS.map((orderStat, index) => (
                        <option value={orderStat}>{orderStat}</option>
                      ))}
                    </Form.Select>
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">
                      Set Delivered Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="deliveredDate"
                      value={
                        orderToUpdate?.deliveredDate !== null
                          ? orderToUpdate?.deliveredDate.split("T")[0]
                          : null
                      }
                      min={
                        new Date(orderToUpdate?.orderedDate)
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Container className="text-center">
                    <Button type="submit" variant="success" className="mx-4">
                      Submit
                    </Button>
                    <Button variant="warning" onClick={handleCloseOfUpdate}>
                      Cancel
                    </Button>
                  </Container>
                </Form>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  return (
    <Card
      className="mb-4 shadow-sm border-0"
      style={{
        borderRadius: "15px",
        backgroundColor: cardBg === "paid" ? "#e3f8e1" : "#f7e6e6",
      }}
    >
      <Card.Body>
        {/* Header - Always Visible */}

        <Row>
          <h6 className="mb-1 text-muted" title="Order_Id">
            Order No <span className="text-primary text-muted">#{orderNo}</span>
          </h6>
        </Row>
        <Row className="align-items-center justify-content-between mb-2">
          <Col xs={8}>
            <h5 className="mb-1" title="Order_Id">
              🧾 Order <span className="text-primary">#{order.orderId}</span>
            </h5>
            <small
              className="text-muted"
              title="Click On This To Get User Information"
            >
              <Link
                to={`/user/profile/${order.user.userId}`}
                style={{ textDecoration: "none" }}
              >
                👤 User Id {order.user.userId}
              </Link>
              <br />
              <Link
                to={`/user/profile/${order.user.userId}`}
                style={{ textDecoration: "none" }}
              >
                👤Name :{order.user.name}
              </Link>
            </small>
          </Col>
          <Col xs={4} className="text-end">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide Details ▲" : "View Details ▼"}
            </Button>
          </Col>
        </Row>

        {/* Only show below content when expanded */}
        <Collapse in={show}>
          <div>
            {/* Summary Tags */}
            <Row>
              <Col>
                <strong>💵 Order Amount:</strong>{" "}
                <Badge bg="dark" title="Order Amount">
                  ₹{order.orderAmount}
                </Badge>
              </Col>
              <Col>
                <p>
                  <strong>👤 Billing Name:</strong> {order.billingName}
                </p>
              </Col>
            </Row>

            {/* Info */}
            <Row className="mb-2">
              <Col md={6}>
                <strong>📅 Ordered On:</strong>{" "}
                {formattedDate(order.orderedDate)}
              </Col>
              <Col md={6}>
                <strong>📦 Delivered On:</strong>{" "}
                {order.deliveredDate === null
                  ? "-"
                  : formattedDate(order.deliveredDate)}
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <strong>📱 Phone:</strong> {order.billingPhone}
                </p>
              </Col>
              <Col>
                <strong>🧾 Payment Status:</strong>{" "}
                <Badge bg={order.paymentStatus ? "success" : "danger"}>
                  {order.paymentStatus ? "Paid" : "Unpaid"}
                </Badge>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <strong>🏠 Address:</strong> {order.billingAddress}
                </p>
              </Col>
              <Col>
                <strong>🚚 Order Status:</strong>{" "}
                <Badge bg="info" className="me-2" title="Order_Status">
                  {order.orderStatus || "Processing"}
                </Badge>
              </Col>
            </Row>

            <div className="mt-3">
              <h6 className="fw-bold mb-2">🛒 Items Ordered</h6>
              <ListGroup variant="flush">
                {order.orderItem.map((item, idx) => (
                  <ListGroup.Item key={idx} className="px-0 py-3">
                    <Row className="align-items-center">
                      <Col xs={3} md={2}>
                        <Image
                          src={
                            item.product.productImage
                              ? `${BASE_URL}/products/image/${item.product.productId}`
                              : defaultProfile
                          }
                          alt={item.product.title}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col xs={9} md={6}>
                        <h6 className="mb-1">{item.product.title}</h6>
                        <small className="text-muted">
                          Quantity: {item.quantity}
                        </small>
                        <h6 className="text-muted mt-1">
                          Price of Individual :{item.product.discountedPrice}
                        </h6>
                        <h6 className="text-muted mt-1">
                          ProductId:{item.product.productId}
                        </h6>
                      </Col>
                      <Col md={4} className="text-md-end">
                        <strong>₹{item.totalPrice}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <Container className="text-center mt-2">
              {console.log("UserData", userData)}
              <Button
                variant="warning mx-4"
                onClick={(event) => handleShowOfUpdate()}
                hidden={userData.user.roles.length === 1}
              >
                Update Order
              </Button>

              <Button
                variant="danger mx-4"
                hidden={userData.user.roles.length === 1}
              >
                Delete Order
              </Button>
              <Button
                variant="success"
                hidden={!(userData.user.roles.length === 1)}
              >
                Click Here To Pay
              </Button>
            </Container>
            {showOfUpdate && showUpdateOrderModal()}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default SingleOrderView;
