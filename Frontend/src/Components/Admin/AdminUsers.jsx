import React, { useEffect, useState } from "react";
import {
  getAllUserService,
  searchUserService,
} from "../../Services/userService";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { BASE_URL } from "../../Services/helperService";
import SingleUserView from "./SingleUserView";

const AdminUsers = () => {
  const [allUser, setAllUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (isSearching && query.trim() !== "") {
      searchUserByPage(currentPage - 1, query);
    } else {
      getAllUser();
    }
  }, [currentPage]);

  useEffect(() => {
    if (query === null || query === undefined || query.trim() === "") {
      getAllUser();
      setIsSearching(false);
    }
  }, [query]);
  const getAllUser = async () => {
    try {
      const response = await getAllUserService(currentPage - 1);
      setAllUser(response);
      setTotalPages(response.totalPages);
      setIsLastPage(response.lastpage);
      console.log("All User " + JSON.stringify(response));
    } catch (error) {
      console.log(
        "Error Occurred in Getting All User " + JSON.stringify(error)
      );
      toast.error("Error Occurred While Fetching All User");
    }
  };
  const colorRepresentaition = () => {
    return (
      <div className="d-flex align-items-center mb-4">
        <h6 className="me-3 mb-0">If Border Color is :</h6>
        <Badge
          bg="danger"
          className="me-2"
          style={{ fontSize: "0.75rem", padding: "6px 10px" }}
        >
          Admin User
        </Badge>
        <Badge
          bg="primary"
          className="me-2"
          style={{ fontSize: "0.75rem", padding: "6px 10px" }}
        >
          Normal User
        </Badge>
      </div>
    );
  };

  const searchUserByPage = async (page, queryParam) => {
    try {
      let response = await searchUserService(page, queryParam);
      setIsSearching(true);
      setAllUser(response);
      setTotalPages(response.totalPages);
      setIsLastPage(response.lastpage);
    } catch (error) {
      console.log(JSON.stringify(error));
      toast.error("Error Occurred While Searching The User");
    }
  };
  const searchUser = async (event) => {
    event.preventDefault();
    console.log("Function Invoked with Query=" + query);
    if (query.trim() === "") return;

    setCurrentPage(1); // reset to page 1 when performing a new search
    searchUserByPage(0, query); // page is 0-indexed
  };
  const viewUser = () => {
    return allUser ? (
      <Container>
        <Card>
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <div className="d-flex flex-column">
                  <h2
                    className="mb-1"
                    style={{ fontWeight: "600", fontSize: "1.5rem" }}
                  >
                    User List
                  </h2>
                  <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {colorRepresentaition()}
                  </div>
                </div>
              </Col>
              <Col className="text-end">
                <Form
                  onSubmit={searchUser}
                  style={{
                    maxWidth: "300px",
                    width: "100%",
                    marginLeft: "auto",
                  }}
                >
                  <InputGroup>
                    <Form.Control
                      type="search"
                      placeholder="Search user..."
                      aria-label="Search"
                      className="shadow-sm"
                      style={{ borderRadius: "0.375rem" }}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <Button
                      variant="primary"
                      style={{ borderRadius: "0.375rem" }}
                      type="submit"
                    >
                      Search
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body>
            {allUser &&
              allUser?.content?.map((user) => <SingleUserView user={user} />)}
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage == 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage == 1}
            />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx}
                active={idx + 1 === currentPage}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={isLastPage}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={isLastPage}
            />
          </Pagination>
        </div>
      </Container>
    ) : (
      //Pagination Code

      <h1>No User Found...</h1>
    );
  };
  return (
    <>
      <div>{viewUser()}</div>
    </>
  );
};

export default AdminUsers;
