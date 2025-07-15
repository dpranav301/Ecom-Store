import React, { useState } from "react";
import {
  Card,
  Button,
  Collapse,
  Badge,
  Image,
  Col,
  Row,
} from "react-bootstrap";
import { BASE_URL } from "../../Services/helperService";
import defaultProfile from "../../asset/profile.jpg";
const SingleUserView = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [bgColor, setBgColor] = useState("");
  // Temporary placeholder image if no imageName provided
  const imageUrl = user.imageName
    ? `${BASE_URL}/user/image/${user.userId}`
    : defaultProfile;

  const cardTitleFunc = () => {
    return (
      <div>
        <Row className="gx-3 d-flex align-items-center">
          <Col md="auto" hidden={open}>
            <img
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
              }}
              src={imageUrl}
              alt="Profile"
              onError={(event) => {
                event.currentTarget.setAttribute("src", defaultProfile); //This Statement Make Sure That If Any Error Occurs While Loading Img then default img will be set
              }}
            />
          </Col>
          <Col>
            <Card.Title className="mb-0">{user.name}</Card.Title>
            <Card.Subtitle
              className="text-muted"
              style={{ fontSize: "0.9rem" }}
            >
              {user.email}
            </Card.Subtitle>
          </Col>
        </Row>
      </div>
    );
  };

  const cardAfterCollapse = () => {
    return (
      <Collapse in={open}>
        <div id={`collapse-${user.userId}`} className="mt-3">
          <Row>
            <Col md={5} sm={12} className="mb-3">
              <Image
                src={imageUrl}
                rounded
                fluid
                style={{
                  height: "200px",
                  width: "100%",
                  objectFit: "contain", // << changed from 'cover' to 'contain'
                  backgroundColor: "#f8f9fa", // light gray background for empty spaces
                  padding: "10px", // nice inner spacing
                }}
                onError={(event) => {
                  event.currentTarget.setAttribute("src", defaultProfile);
                }}
              />
            </Col>

            <Col md={7} sm={12}>
              <Card.Text>
                <strong>Gender:</strong> {user.gender || "N/A"}
              </Card.Text>
              <Card.Text>
                <strong>About:</strong> {user.about || "No details provided."}
              </Card.Text>
              <div>
                <strong>Roles:</strong>
                <div className="mt-1">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <Badge
                        key={index}
                        pill
                        // bg="info"
                        text="white"
                        className="me-2 mb-2"
                        bg={
                          role.roleName === "ROLE_ADMIN" ? "danger" : "primary"
                        }
                      >
                        {role.roleName}
                      </Badge>
                    ))
                  ) : (
                    <Badge pill bg="secondary">
                      No Role Assigned
                    </Badge>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Collapse>
    );
  };
  return (
    <Card
      className="my-3 shadow-sm rounded"
      border={user.roles.length === 2 ? "danger" : "primary"}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          {cardTitleFunc()}
          <Button
            variant={open ? "outline-danger" : "outline-primary"}
            onClick={() => setOpen(!open)}
            aria-controls={`collapse-${user.userId}`}
            aria-expanded={open}
            size="sm"
          >
            {open ? "Hide" : "View"}
          </Button>
        </div>
        {cardAfterCollapse()}
      </Card.Body>
    </Card>
  );
};

export default SingleUserView;
