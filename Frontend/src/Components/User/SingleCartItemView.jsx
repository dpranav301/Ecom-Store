import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { BASE_URL } from "../../Services/helperService";
import NoImage from "../../asset/NoImage.png";
import { toast } from "react-toastify";
// const SingleCartItemView = ({
//   index,
//   item,
//   addItemToCart,
//   removeItemFromCart,
// }) => {
//   return (
//     <Card key={index} className="mb-3 shadow-sm rounded-4 border-0">
//       <Card.Body>
//         <Row className="align-items-center">
//           {/* Product Image */}
//           <Col xs={12} md={2} className="text-center mb-3 mb-md-0">
//             <img
//               src={`${BASE_URL}/products/image/${item.product.productId}`}
//               alt={item.product.title}
//               style={{
//                 width: "90px",
//                 height: "90px",
//                 objectFit: "cover",
//                 borderRadius: "50%",
//                 border: "2px solid #dee2e6",
//               }}
//               onError={(event) =>
//                 event.currentTarget.setAttribute("src", NoImage)
//               }
//             />
//           </Col>

//           {/* Product Info */}
//           <Col xs={12} md={7}>
//             <h5 className="fw-semibold">{item.product.title}</h5>
//             <Row className="text-muted small">
//               <Col xs={4}>Qty: {item.quantity}</Col>
//               <Col xs={4}>Price: ₹{item.product.discountedPrice}</Col>
//               <Col xs={4}>
//                 Total: {item.quantity} * {item.product.discountedPrice}
//               </Col>
//             </Row>
//           </Col>

//           {/* Action Buttons */}
//           <Col xs={12} md={3} className="text-md-end mt-3 mt-md-0">
//             <Button
//               variant="outline-danger"
//               size="sm"
//               className="me-2"
//               onClick={() =>
//                 removeItemFromCart(item.cartItemId, () => {
//                   toast.info("Quantity Updated");
//                 })
//               }
//             >
//               Remove 1
//             </Button>
//             <Button
//               variant="outline-success"
//               size="sm"
//               onClick={() =>
//                 addItemToCart(item.product.productId, 1, () => {
//                   toast.success("Quantity Updated");
//                 })
//               }
//             >
//               Add 1
//             </Button>
//           </Col>
//         </Row>
//       </Card.Body>
//     </Card>
//   );
// };

const SingleCartItemView = ({
  index,
  item,
  addItemToCart,
  removeItemFromCart,
}) => {
  return (
    <Card key={index} className="mb-3 shadow-sm rounded-4 border-0">
      <Card.Body>
        <Row className="align-items-start">
          {/* Cart Item Content */}
          <Col xs={12} md={12}>
            <Row className="align-items-center">
              <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                <img
                  src={`${BASE_URL}/products/image/${item.product.productId}`}
                  alt={item.product.title}
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #dee2e6",
                  }}
                  onError={(event) =>
                    event.currentTarget.setAttribute("src", NoImage)
                  }
                />
              </Col>

              <Col xs={12} md={9}>
                <h5 className="fw-semibold">{item.product.title}</h5>
                <Row className="text-muted small">
                  <Col xs={4}>Qty: {item.quantity}</Col>
                  <Col xs={4}>Price: ₹{item.product.discountedPrice}</Col>
                  <Col xs={4}>
                    Total: {item.quantity} * {item.product.discountedPrice}
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      removeItemFromCart(item.cartItemId, () =>
                        toast.info("Quantity Updated")
                      )
                    }
                  >
                    Remove 1
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() =>
                      addItemToCart(item.product.productId, 1, () =>
                        toast.success("Quantity Updated")
                      )
                    }
                  >
                    Add 1
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SingleCartItemView;
