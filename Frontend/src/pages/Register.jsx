import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import Base from "../Components/Base";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../Services/userService";
const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    about: "",
    confirmPassword: "",
  });

  const handleChange = (event, property) => {
    // console.log("Property is {}", event);
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const [errorData, setErrorData] = useState({
    isError: false,
    errorData: null,
  });

  const [loading, setLoading] = useState(false);
  const submitForm = (event) => {
    event.preventDefault();
    //Apply Validation Before Submitting Data to Server

    if (
      data.name === null ||
      data.name === undefined ||
      data.name.trim() === ""
    ) {
      toast.error("Name Is Required");
      // return;
    }

    if (
      data.email === null ||
      data.email === undefined ||
      data.email.trim() === ""
    ) {
      toast.error("Email Is Required");
      // return;
    }

    if (
      data.password === null ||
      data.password === undefined ||
      data.password.trim() === ""
    ) {
      toast.error("Password Is Required");
    }

    if (
      data.password === null ||
      data.password === undefined ||
      data.password.trim() === ""
    ) {
      toast.error("Confirm Password Is Required");
    } else {
      if (data.password !== data.confirmPassword) {
        toast.info("Confirm Password Must Be Same As That of Password");
      }
    }
    console.log("Data In Submit Form ", data);

    if (
      data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword
    ) {
    } else {
      setLoading(true);
      registerUser(data)
        .then((userData) => {
          setErrorData({
            isError: false,
            errorData: null,
          });
          toast.success("User Created Successfully");

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
              ? "Error in Creating User"
              : error?.response?.data?.message
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const resetData = () => {
    setData({
      name: "",
      email: "",
      password: "",
      gender: "",
      about: "",
      confirmPassword: "",
    });
  };
  // Always Make Different Function to return HTML so that we can use Conditional Rendering
  const registerForm = () => {
    return (
      <Container className="mt-2 mb-2">
        <Row>
          {/* {JSON.stringify(data)} */}
          <Col sm={{ span: 8, offset: 2 }}>
            <Card className="shadow-lg">
              {/* <Card.Header as={"h5"} className="text-center">
                Registration Form
              </Card.Header> */}
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
                  <h3>Registration Form</h3>
                </Container>
                <Form onSubmit={submitForm} noValidate>
                  {/* This is Name Field */}
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Enter Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      isInvalid={errorData.errorData?.response?.data?.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid Name
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* This is Email Field */}
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Enter Your Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      isInvalid={errorData.errorData?.response?.data?.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid Email
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* This is Password Field */}
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Enter Your Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Your Password"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      isInvalid={errorData.errorData?.response?.data?.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errorData.errorData?.response?.data?.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Re-Enter Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Your Password"
                      name="confirmPassword"
                      value={data.confirmPassword}
                      onChange={handleChange}
                      isInvalid={
                        data.password &&
                        data.confirmPassword &&
                        data.password !== data.confirmPassword
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      Confirm Password Must Be Same As Password
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="gender"
                      value={data.gender}
                      onChange={handleChange}
                      isInvalid={errorData.errorData?.response?.data?.gender}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errorData.errorData?.response?.data?.gender}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formSomethingAbout">
                    <Form.Label>Write Something About Yourself</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="about"
                      value={data.about}
                      onChange={handleChange}
                      isInvalid={errorData.errorData?.response?.data?.about}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errorData.errorData?.response?.data?.about}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Container>
                    <p className="text-center">
                      Already Register <Link to={"/login"}>Login Here</Link>
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
                      <span hidden={loading}>Register</span>
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
  return (
    <Base title="Registration Form">
      {/* <h1>This is Register Page</h1>; */}

      {registerForm()}
    </Base>
  );
};
export default Register;
