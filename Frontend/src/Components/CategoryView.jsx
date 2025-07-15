// import React from "react";
// import { Row, Col, Container, Button, Card } from "react-bootstrap";

// const CategoryView = () => {
//   return (
//     <>
//       <Card className="mb-3">
//         <Row>
//           <Col md={2}>Image</Col>
//           <Col md={10}>
//             <Card.Body>
//               <Card.Title>Category Title</Card.Title>
//               <Card.Text>Hello This is Category Description</Card.Text>
//               <Container className="text-center">
//                 <Button variant="warning" className="me-2">
//                   Update
//                 </Button>
//                 <Button variant="danger">Delete</Button>
//               </Container>
//             </Card.Body>
//           </Col>
//         </Row>
//       </Card>
//     </>
//   );
// };

// export default CategoryView;

// import { Card, Button, Container, Row, Col } from "react-bootstrap";
// import defaultProfile from "../logo.svg";
// const CategoryView = () => {
//   return (
//     <Card className="shadow-sm rounded-4 overflow-hidden mb-4 border-0">
//       <Row className="g-0">
//         <Col md={3}>
//           <div className="h-100 d-flex align-items-center justify-content-center bg-light">
//             <img
//               src={defaultProfile} // Replace with actual category image
//               alt="Category"
//               className="img-fluid rounded-start"
//               style={{ maxHeight: "150px", objectFit: "cover" }}
//             />
//           </div>
//         </Col>
//         <Col md={9}>
//           <Card.Body className="p-4">
//             <Card.Title className="fw-bold fs-4 text-black">
//               Category Title
//             </Card.Title>
//             <Card.Text className="text-muted">
//               Hello, this is the category description. A short and concise
//               overview.
//             </Card.Text>
//             <Container className="text-end">
//               <Button variant="outline-warning" className="me-2 px-4">
//                 Update
//               </Button>
//               <Button variant="outline-danger" className="px-4">
//                 Delete
//               </Button>
//             </Container>
//           </Card.Body>
//         </Col>
//       </Row>
//     </Card>
//   );
// };

// export default CategoryView;

import { useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import defaultProfile from "../logo.svg";
import { BASE_URL } from "../Services/helperService";
const CategoryView = ({
  category,
  deleteCategoryFromMainFunc,
  handleShowForCategoryUpdateForm,
}) => {
  //Image Of Category
  const imgUrl = category.coverImage
    ? `${BASE_URL}/category/image/${category.categoryId}`
    : defaultProfile;
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  return (
    <Card className="shadow-sm rounded-4 overflow-hidden mb-4 border-0">
      <Row className="g-0">
        <Col md={3}>
          <div className="h-100 d-flex align-items-center justify-content-center bg-light">
            <img
              // src={
              //   category.coverImage !== undefined &&
              //   category.coverImage.startsWith("http")
              //     ? category.coverImage
              //     : defaultProfile
              // } // Replace with actual category image
              src={imgUrl}
              alt="Category"
              className="img-fluid rounded-start"
              style={{ maxHeight: "150px", objectFit: "cover" }}
            />
          </div>
        </Col>
        <Col md={9}>
          <Card.Body className="p-4">
            <Card.Title className="fw-bold fs-4 text-black">
              {category.title}
            </Card.Title>

            {showDetails && (
              <Card.Text className="text-secondary mt-2">
                {category.description}
              </Card.Text>
            )}

            <Container className="text-end">
              <Button
                variant="outline-info"
                className="me-2 px-4"
                onClick={toggleDetails}
              >
                {showDetails ? "Hide Info" : "Info"}
              </Button>
              <Button
                variant="outline-warning"
                className="me-2 px-4"
                onClick={(event) => handleShowForCategoryUpdateForm(category)}
              >
                Update
              </Button>
              {/* {show && updateCategoryFromMain(categoryToUpdate)} */}
              <Button
                variant="outline-danger"
                className="px-4"
                onClick={(event) =>
                  deleteCategoryFromMainFunc(category.categoryId)
                }
              >
                Delete
              </Button>
            </Container>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default CategoryView;
