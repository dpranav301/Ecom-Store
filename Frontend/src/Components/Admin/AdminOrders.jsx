import React, { useEffect, useState } from "react";
import {
  getAllOrderService,
  searchOrderService,
} from "../../Services/orderService";
import { toast } from "react-toastify";
import { ADMIN_ORDER_PAGE_SIZE } from "../../Services/helperService";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import SingleOrderView from "./SingleOrderView";
import { getJwtTokenFromLocalStorage } from "../../storage/sessionStorageHelper";
import { isJwtExpired } from "jwt-check-expiration";

const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // zero-based
  const [totalPage, setTotalPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [query, setQuery] = useState("");

  const jwtToken = getJwtTokenFromLocalStorage();
  const isExpired = isJwtExpired(jwtToken);
  useEffect(() => {
    // console.log("Use Effetc Invoked");
    if (
      !isExpired &&
      (query === null || query === undefined || query.trim() === "")
    )
      fetchOrdersByPage(currentPage);
  }, [currentPage, query]);

  const searchOrder = async (event) => {
    event.preventDefault();
    console.log("Function Invoked with Query=" + query);
    try {
      let response = await searchOrderService(currentPage, query);
      console.log("Response From Search " + JSON.stringify(response));
      setAllOrders(response.content); // 🟢 REPLACE content, don't append
      setTotalPage(response.totalPages);
      setLastPage(response.lastpage);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong while fetching orders");
    }
  };
  const fetchOrdersByPage = async (page) => {
    try {
      const response = await getAllOrderService(page, ADMIN_ORDER_PAGE_SIZE);
      setAllOrders(response.content); // 🟢 REPLACE content, don't append
      setTotalPage(response.totalPages);
      setLastPage(response.lastpage);
    } catch (e) {
      console.error("Error fetching orders:", e);
      toast.error("Something went wrong while fetching orders");
    }
  };

  const handleChangeOfQuery = (event) => {
    const { name, value } = event.target;
    console.log(value);
    setQuery(value);
  };
  const renderOrders = () => {
    console.log("Orders Inside renderOrders " + JSON.stringify(allOrders));
    if (!allOrders || allOrders.length === 0) {
      return <h5>No Orders Found !!!</h5>;
    }

    return (
      <Card>
        <Card.Header>
          <Row>
            <Col>
              <h4>
                <strong>All Orders</strong>
              </h4>
            </Col>
            <Col>
              <Form
                style={{
                  maxWidth: "300px",
                  width: "100%",
                  position: "relative",
                }}
                onSubmit={searchOrder}
              >
                <InputGroup>
                  <Form.Control
                    type="search"
                    placeholder="Please Enter OrderId..."
                    aria-label="Search"
                    name="search_order_Id"
                    value={query}
                    onChange={handleChangeOfQuery}
                  />
                  <Button variant="outline-secondary" type="submit">
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {allOrders.map((order, index) => (
            <SingleOrderView
              orders={order}
              orderNo={currentPage * ADMIN_ORDER_PAGE_SIZE + index + 1}
              key={order.orderId}
            />
          ))}

          <div className="d-flex justify-content-end mt-4">
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              />
              {[...Array(totalPage)].map((_, idx) => (
                <Pagination.Item
                  key={idx}
                  active={idx === currentPage}
                  onClick={() => setCurrentPage(idx)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={lastPage}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPage - 1)}
                disabled={lastPage}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="mt-0">
      <Row>
        <Col>{renderOrders()}</Col>
      </Row>
    </Container>
  );
};

export default AdminOrders;
