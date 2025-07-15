import React, { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate } from "react-router-dom";
import UserContext from "../context/userContext";
import CartContext from "../context/cartContext";
function CustomNavbar() {
  const userContext = useContext(UserContext);

  const logoutFunction = () => {
    userContext.logoutFun();
  };

  const { cart } = useContext(CartContext);
  console.log("cart in Navbar ", cart);
  const cartItemLength = cart?.cartItem?.length;
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img src="/logo192.png" alt="logo" height={30} width={24} />
          Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/services">
              Services
            </Nav.Link>
            <NavDropdown title="Contact" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Facebook</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Instagram</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Youtube</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Alternate Contact
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={NavLink} to="/store">
              Store
            </Nav.Link>
            {!userContext.login ? (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  SignUp
                </Nav.Link>
              </>
            ) : userContext.isAdminUser ? (
              <>
                <Nav.Link
                  as={NavLink}
                  to={`/admin/profile/${userContext.userData?.user?.userId}`}
                >
                  {userContext?.userData?.user?.email}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/home">
                  adminHome
                </Nav.Link>
                <Nav.Link onClick={logoutFunction}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to={`/user/profile/${userContext.userData?.user?.userId}`}
                >
                  {userContext?.userData?.user?.email}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/user/cart">
                  Cart
                  {cartItemLength !== 0 ? (
                    <span>
                      {"("}
                      {cartItemLength}
                      {")"}
                    </span>
                  ) : (
                    ""
                  )}
                </Nav.Link>
                <Nav.Link as={NavLink} to={"/user/orders"}>
                  Orders
                </Nav.Link>
                <Nav.Link onClick={() => userContext.logoutFun()}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
