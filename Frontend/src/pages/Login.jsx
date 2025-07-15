import {
  Col,
  Container,
  Card,
  Row,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import Base from "../Components/Base";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Services/userService";
import UserContext from "../context/userContext";

const Login = () => {
  const userContext = useContext(UserContext);
  // console.log("User Context", userContext);
  const [data, setData] = useState({ email: "", password: "" });
  const resetData = () => {
    console.log("Reset Function is Call");
    setData({
      email: "",
      password: "",
    });
  };

  const handleChange = (event) => {
    // console.log("Property is {}", event);
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });

    setErrorData({
      isError: false,
      errorData: null,
    });
  };

  const [errorData, setErrorData] = useState({
    isError: false,
    errorData: null,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const submitForm = (event) => {
    event.preventDefault();
    if (
      data.email === null ||
      data.email === undefined ||
      data.email.trim() === ""
    ) {
      toast.error("Email Is Required");
      return;
    }
    if (
      data.password === null ||
      data.password === undefined ||
      data.password.trim() === ""
    ) {
      toast.error("Password Is Required");
      return;
    }
    setLoading(true);
    loginUser(data)
      .then((userData) => {
        toast.success("User Login Successfully");
        setErrorData({
          isError: false,
          errorData: null,
        });
        // console.log(userData);
        //if normal user login successfully then move to user dashboard
        // userContext.setIsLogin(true);
        // userContext.setUserData(userData);
        userContext.loginFun(userData);
        navigate("/user/home");
        //if admin user login successfully then move to admin dashboard
        resetData();
      })
      .catch((error) => {
        console.log(error);
        setErrorData({
          isError: true,
          errorData: error,
        });

        toast.error(
          error?.response?.data?.message == null
            ? "Error While Login"
            : error?.response?.data?.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const loginForm = () => {
    return (
      <Container className="mt-2 mb-2">
        <Row>
          <Col sm={{ span: 8, offset: 2 }}>
            <Card className="shadow-lg">
              <Card.Body>
                <Container className="text-center">
                  <img
                    src="/logo512.png"
                    alt="logo"
                    height={"40px"}
                    width={"40px"}
                  />
                </Container>
                <Container className="text-center">
                  <h3>Login Form</h3>
                </Container>
                <Form onSubmit={submitForm} noValidate>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Enter Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      name="email"
                      onChange={handleChange}
                      value={data.email}
                      isInvalid={errorData.errorData?.response?.data?.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid Email
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Enter Your Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Your Password"
                      name="password"
                      onChange={handleChange}
                      value={data.password}
                      isInvalid={errorData.errorData?.response?.data?.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid Password
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Container>
                    {/* <p className="text-center">
                      Forgot Password <Link to={"/#"}>Login Here</Link>
                    </p> */}

                    <p className="text-center">
                      If Not Register then{" "}
                      <Link to={"/register"}>Click Here To Regsiter</Link>
                    </p>
                  </Container>
                  <Container className="text-center">
                    <Button
                      variant="success"
                      className="text-uppercase"
                      type="submit"
                      disabled={loading}
                    >
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                        hidden={!loading}
                      />
                      <span hidden={!loading}>Wait...</span>
                      <span hidden={loading}>Login</span>
                    </Button>
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={resetData}
                    >
                      Reset
                    </Button>
                  </Container>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };
  return <Base title="Login Here">{loginForm()}</Base>;
};
export default Login;
