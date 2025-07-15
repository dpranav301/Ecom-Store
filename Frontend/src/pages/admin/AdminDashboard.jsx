import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { isLoginUserIsAdmin } from "../../storage/sessionStorageHelper";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
import UserContext from "../../context/userContext";
import { Col, Container, Row } from "react-bootstrap";
import SideMenu from "../../Components/Admin/SideMenu";
import useJwtTokenExpire from "../../CustomHooks/useJwtTokenExpire";
const AdminDashboard = () => {
  const jwtTokenExpire = useJwtTokenExpire();

  if (jwtTokenExpire) {
    console.log("JWT Token Expired in AdminDashboard");
  }
  const userContext = useContext(UserContext);
  console.log("User Context", userContext);
  const adminDashBoardJsx = () => {
    return (
      <div>
        <Container fluid className="px-5">
          <Row className="mt-3">
            <Col
              // md={{
              //   span: 2,
              //   offset: 1,
              // }}
              md={2}
              className="ps-0"
            >
              <SideMenu />
            </Col>
            <Col className=" pt-2 ps-2" md={{ span: 10, offset: -1 }}>
              <Outlet />
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  //This Line Manages Private Routes
  return adminDashBoardJsx();
};

export default AdminDashboard;
