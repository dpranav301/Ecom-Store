import { React, useState, useEffect, useContext } from "react";
import {
  Card,
  Table,
  Row,
  Col,
  Badge,
  Button,
  Container,
  Modal,
  Form,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import defaultProfile from "../asset/profile.jpg"; // Default profile image
import { BASE_URL } from "../Services/helperService";
import { useParams } from "react-router-dom";
import userContext from "../context/userContext";
import {
  getUser,
  updateUser,
  updateUserProfileImg,
} from "../Services/userService";
import { toast } from "react-toastify";
const ProfileView = () => {
  const userCont = useContext(userContext);
  console.log("User COntext ", userCont);
  const [user, setUser] = useState({});
  // const userId = userCont.userData?.user?.userId;
  const { userId } = useParams();
  const [changeInProfile, setChangeInProfile] = useState(false);
  //This Three are releated to modal
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  //This is Releated To Profile Image
  // Construct image URL dynamically
  const imageUrl = user?.imageName
    ? `${BASE_URL}/user/image/${user?.userId}`
    : defaultProfile;

  const [previewImg, setPreviewImg] = useState({
    placeholder: defaultProfile,
    file: null,
  });
  const handleProfileImgFunc = (event) => {
    const localFile = event.target.files[0];
    // console.log(localFile);
    console.log(previewImg);
    if (localFile.type === "application/pdf") {
      toast.error("Please Select Img file");
      setPreviewImg({
        placeholder: defaultProfile,
        file: null,
      });
    } else {
      setChangeInProfile(true);
      //For Preview of Img we will use FileReader
      const reader = new FileReader();
      reader.onload = (r) => {
        //Always Define onload function before readAsDataURL because it reads file asynchronously
        console.log(r);
        setPreviewImg({
          placeholder: r.target.result,
          file: localFile,
        });
      };
      reader.readAsDataURL(localFile);
    }
  };

  const updateUserProfileImage = () => {
    console.log("Inside updateUserProfileImage " + userId);
    console.log("Inside updateUserProfileImage " + JSON.stringify(previewImg));
    updateUserProfileImg(previewImg.file, userId)
      .then((data) => {
        console.log(data);
        toast.success("Image Uploaded Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Image Not Uploaded Sucessfully");
      });
  };
  const handleClose = () => {
    setShow(false);
    setChangeInProfile(false);
  };
  const handleShow = () => setShow(true);
  const getUserFromServer = () => {
    getUser(userId)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error In Loading user information from server");
      });
  };
  const handleChange = (event, property) => {
    // console.log("Property is {}", event);
    setChangeInProfile(true);
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const updateUserFunc = async () => {
    if (changeInProfile) {
      setLoading(true);
      try {
        console.log("User That is Passing to Update " + JSON.stringify(user));
        // ✅ First API call: Update user
        await updateUser(user);

        // ✅ Second API call: Update profile image
        await updateUserProfileImage();

        // ✅ If both succeed, show success toast
        toast.success("User Updated Successfully");
      } catch (error) {
        // ❌ If any API fails, this block runs
        console.log(error);
        toast.error(error?.response?.data?.message ?? "Error in Updating User");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No Change in User Profile");
      handleClose();
    }
  };

  const UpdateView = () => {
    return (
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-3 text-primary">User Details</h5>
              <Table responsive className="table-borderless">
                <tbody>
                  {/* image Filed */}
                  <tr>
                    <td className="fw-semibold text-muted align-middle">
                      Profile Image
                    </td>
                    <td>
                      <img
                        src={previewImg.placeholder}
                        alt=""
                        height={200}
                        className="rounded-square border shadow-sm m-2"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <InputGroup>
                        <Form.Control
                          type="file"
                          onChange={handleProfileImgFunc}
                        />
                        <Button
                          onClick={() =>
                            setPreviewImg({
                              file: null,
                              placeholder: defaultProfile,
                            })
                          }
                        >
                          Clear
                        </Button>
                      </InputGroup>
                      <p className="fw-semibold text-muted align-middle">
                        Please Select Image to upload
                      </p>
                    </td>
                  </tr>
                  {/* Name Field */}
                  <tr>
                    <td className="fw-semibold text-muted align-middle">
                      Name:
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        // value={user.name}
                        placeholder={user?.name}
                        className="text-capitalize"
                        onChange={handleChange}
                        name="name"
                      />
                    </td>
                  </tr>

                  {/* Gender Field */}
                  <tr>
                    <td className="fw-semibold text-muted align-middle">
                      Gender:
                    </td>
                    <td className="text-capitalize">{user?.gender || "N/A"}</td>
                  </tr>

                  {/* Email Field */}
                  <tr>
                    <td className="fw-semibold text-muted align-middle">
                      Email:
                    </td>
                    <td className="text-capitalize">{user?.email || "N/A"}</td>
                  </tr>

                  {/* About Field */}
                  <tr>
                    <td className="fw-semibold text-muted align-middle">
                      About:
                    </td>
                    <td>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        // value={user.about}
                        placeholder={user?.about}
                        onChange={handleChange}
                        name="about"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Password</td>
                    <td>
                      <Form.Control
                        type="password"
                        placeholder="Please Enter Your New Password"
                        onChange={handleChange}
                        name="password"
                      />
                    </td>
                  </tr>

                  {/* Role Field */}
                  <tr>
                    <td className="fw-semibold text-muted align-middle">
                      Role:
                    </td>
                    <td>
                      {user?.roles?.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {user?.roles.map((role, index) => (
                            <Badge
                              key={index}
                              bg="success"
                              className="px-3 py-1"
                            >
                              {role.roleName}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="primary" onClick={updateUserFunc} disabled={loading}>
            <Spinner
              animation="border"
              size="sm"
              className="me-2"
              hidden={!loading}
            />
            <span hidden={!loading}>Wait...</span>
            <span hidden={loading}>Save Changes</span>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  useEffect(() => {
    getUserFromServer();
  }, []);

  return (
    <>
      <Card className="m-4 shadow border-0 rounded-4">
        <Card.Body className="p-4">
          {/* Profile Image & Name */}
          <div className="text-center mb-4">
            <img
              src={imageUrl}
              alt="User Profile"
              className="rounded-circle border shadow-sm"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
              onError={(e) => (e.target.src = defaultProfile)} // Fallback if the image fails to load
            />
            <h4 className="mt-3 mb-0 text-uppercase fw-bold text-primary">
              {user?.name || "N/A"}
            </h4>
            <p className="text-muted fs-6">{user?.email || "N/A"}</p>
          </div>

          {/* Profile Information */}
          <Row className="justify-content-center">
            <Col md={8}>
              <Table responsive className="table-borderless">
                <tbody>
                  <tr>
                    <td className="fw-semibold text-muted">Gender:</td>
                    <td className="text-capitalize">{user?.gender || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">About:</td>
                    <td>{user?.about || "No details provided"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Role:</td>
                    <td>
                      {user?.roles?.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {user?.roles.map((role, index) => (
                            <Badge
                              key={index}
                              bg="success"
                              className="px-3 py-1"
                            >
                              {role.roleName}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>

        {/* Action Buttons */}
        {userCont?.userData.user?.userId === userId ? (
          <Container className="text-center pb-3">
            <Button variant="primary" className="me-2" onClick={handleShow}>
              Update Profile
            </Button>
            <Button variant="outline-secondary">View Orders</Button>
          </Container>
        ) : (
          ""
        )}
      </Card>
      {UpdateView()}
    </>
  );
};

export default ProfileView;
