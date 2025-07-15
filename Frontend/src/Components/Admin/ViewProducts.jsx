import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Button,
  ButtonGroup,
  InputGroup,
  Form,
  Pagination,
  Modal,
  Badge,
  Image,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import {
  deleteProduct,
  fetchAllProduct,
  searchProductService,
  updateCategoryOfProdService,
  updateProduct,
  updateProductService,
  uploadProductImageService,
} from "../../Services/productService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import defaultProfile from "../../logo.svg";
import { BASE_URL } from "../../Services/helperService";
import { getAllCategory } from "../../Services/categoryService";

const ViewProducts = () => {
  //Modal Releated Changes
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  //Update Modal Releated Changes
  const [showOfUpdate, setShowOfUpdate] = useState(false);
  const handleCloseOfUpdate = () => {
    setShowOfUpdate(false);
  };
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [updatedProdImg, setUpdatedProdImg] = useState({
    placeholder: null,
    file: null,
    status: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [products, setProducts] = useState(null);
  const [listOfProduct, setListOfProduct] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [productToView, setProductToView] = useState(null);
  const [wantToUpdateCategory, setWantToUpdateCategory] = useState(false);
  const [allCategories, setAllCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    status: null,
    categoryId: null,
  });

  //Search Realted States
  const [query, setQuery] = useState("");
  const [searchProduct, setSearchProduct] = useState([]);
  useEffect(() => {
    fetchAllProduct(currentPage - 1)
      .then((data) => {
        console.log(
          "Use Effect Of Dependency currentPage" + JSON.stringify(data)
        );
        setProducts(data);
        setTotalPages(data.totalPages);
        setIsLastPage(data.lastpage);
        setListOfProduct(data.content);
      })
      .catch((error) => {
        toast.error("Something Went Wrong");
      });
    console.log("Value of Query is " + query);
  }, [currentPage, query]);

  //This Is To Load All Categories When button click happens
  useEffect(() => {
    if (wantToUpdateCategory !== null && wantToUpdateCategory === true) {
      getAllCategory(0, 1000)
        .then((data) => {
          console.log(JSON.stringify(data));
          setAllCategories(data);
        })
        .catch((error) => {
          toast.error("Something Went Wrong While Fetching Categories");
        });
    }
  }, [wantToUpdateCategory]);

  const deleteProducts = (productId) => {
    Swal.fire({
      title: "Want To Delete Product",
      text: "Once deleted, you will not be able to recover this product!",
      showCancelButton: true, // ✅ Enables the Cancel button
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log("Deleting The Product With Id " + productId);
        deleteProduct(productId)
          .then((data) => {
            setListOfProduct((prevProd) => {
              return prevProd.filter((prod) => prod.productId !== productId);
            });
            setQuery(""); //This is To Update TableView product is Deleted it part of search functionality
            // setProducts(products.content(listOfProduct));
            Swal.fire("Deleted!", "The Product has been deleted.", "success");
          })
          .catch((error) => {
            toast.error("Something Went Wrong While Deleting Product");
          });
      }
    });
  };

  const handleShowOfProduct = (product) => {
    console.log("Product In HandleShowOfProduct is " + JSON.stringify(product));
    setShow(true);
    setProductToView(product);
  };
  const viewIndividualProd = (product) => {
    console.log("View Individual Product Invoked " + JSON.stringify(product));
    //Image Of Product
    const imgUrl = product.productImage
      ? `${BASE_URL}/products/image/${product.productId}`
      : defaultProfile;
    return (
      <>
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Product Details - {product.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              {/* Image Section */}
              <Col
                md={5}
                className="d-flex align-items-center justify-content-center"
              >
                <Image
                  src={imgUrl}
                  alt={product.title}
                  fluid
                  rounded
                  style={{
                    maxHeight: "250px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                    padding: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                />
              </Col>

              {/* Product Details */}
              <Col md={7}>
                <Row className="mb-2">
                  <Col xs={6}>
                    <strong>Quantity:</strong>
                  </Col>
                  <Col xs={6}>{product.quantity}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <strong>Price:</strong>
                  </Col>
                  <Col xs={6}>₹{product.price}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <strong>Discounted Price:</strong>
                  </Col>
                  <Col xs={6}>₹{product.discountedPrice}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <strong>Category:</strong>
                  </Col>
                  <Col xs={6}>
                    {product.category?.title ?? (
                      <span className="text-muted">N/A</span>
                    )}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <strong>Live:</strong>
                  </Col>
                  <Col xs={6}>
                    <Badge bg={product.live ? "success" : "danger"}>
                      {product.live ? "Yes" : "No"}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <strong>Stock Available:</strong>
                  </Col>
                  <Col xs={6}>
                    <Badge bg={product.stock ? "success" : "danger"}>
                      {product.stock ? "Yes" : "No"}
                    </Badge>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Description */}
            <Row className="mt-4">
              <Col>
                <strong>Description:</strong>
                <div className="text-muted mt-1">
                  {product.description || "No description provided."}
                </div>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const handleShowForUpdateModal = (product) => {
    const imgUrl = product.productImage
      ? `${BASE_URL}/products/image/${product.productId}`
      : defaultProfile;
    setShowOfUpdate(true);
    console.log("Product To Update is " + JSON.stringify(product));
    setProductToUpdate(product);
    setUpdatedProdImg({
      placeholder: imgUrl,
    });
  };
  const productToUpdateModal = (product) => {
    return (
      <>
        <Modal
          show={showOfUpdate}
          onHide={handleCloseOfUpdate}
          centered
          size="lg"
        >
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Form onSubmit={handleSubmitToUpdateProd}>
                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder={product.title}
                      onChange={handleChangeToUpdateProd}
                      className="shadow-sm"
                    />
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder={product.description}
                      name="description"
                      onChange={handleChangeToUpdateProd}
                      className="shadow-sm"
                    />
                  </FormGroup>

                  <Row>
                    <Col>
                      <FormGroup className="mb-4">
                        <Form.Label className="fw-bold">Price</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          placeholder={product.price}
                          name="price"
                          onChange={handleChangeToUpdateProd}
                          className="shadow-sm"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="mb-4">
                        <Form.Label className="fw-bold">
                          Discounted Price
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          placeholder={product.discountedPrice}
                          name="discountedPrice"
                          onChange={handleChangeToUpdateProd}
                          className="shadow-sm"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder={product.quantity}
                      min="1"
                      name="quantity"
                      onChange={handleChangeToUpdateProd}
                      className="shadow-sm"
                    />
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">
                      Is Product Live?
                    </Form.Label>
                    <div className="d-flex gap-4">
                      <Form.Check
                        type="radio"
                        name="live"
                        label="Yes"
                        value="true"
                        onChange={() =>
                          setProductToUpdate((prevProduct) => ({
                            ...prevProduct,
                            live: true,
                          }))
                        }
                        checked={productToUpdate.live === true}
                      />
                      <Form.Check
                        type="radio"
                        name="live"
                        label="No"
                        value="false"
                        onChange={() =>
                          setProductToUpdate((prevProduct) => ({
                            ...prevProduct,
                            live: false,
                          }))
                        }
                        checked={productToUpdate.live === false}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Form.Label className="fw-bold">
                      Is Product In Stock?
                    </Form.Label>
                    <div className="d-flex gap-4">
                      <Form.Check
                        type="radio"
                        name="stock"
                        label="Yes"
                        value="true"
                        onChange={() =>
                          setProductToUpdate((prevProduct) => ({
                            ...prevProduct,
                            stock: true,
                          }))
                        }
                        checked={productToUpdate.stock === true}
                      />
                      <Form.Check
                        type="radio"
                        name="stock"
                        label="No"
                        value="false"
                        onChange={() =>
                          setProductToUpdate((prevProduct) => ({
                            ...prevProduct,
                            stock: false,
                          }))
                        }
                        checked={productToUpdate.stock === false}
                      />
                    </div>
                  </FormGroup>

                  <Container className="text-center mb-4">
                    {updatedProdImg.placeholder && (
                      <>
                        <img
                          src={updatedProdImg.placeholder}
                          alt="Product"
                          className="img-thumbnail rounded shadow-sm"
                          style={{ maxHeight: "250px", objectFit: "contain" }}
                        />
                        <p className="text-muted mt-2">Image Preview</p>
                      </>
                    )}
                  </Container>

                  <FormGroup className="mb-4">
                    <FormLabel className="fw-bold">
                      Upload Product Image
                    </FormLabel>
                    <Form.Control
                      type="file"
                      onChange={handlUpdateProductImg}
                    />
                    <div className="text-center mt-3 d-flex justify-content-center gap-3">
                      <Button variant="success" onClick={uploadUpdatedProdImg}>
                        Upload Image
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          setUpdatedProdImg({
                            placeholder: null,
                            file: null,
                            status: null,
                          })
                        }
                      >
                        Clear Image
                      </Button>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel className="fw-bold">
                      Want To Update Category
                    </FormLabel>
                    <div className="d-flex gap-4">
                      <Form.Check
                        type="radio"
                        label="Yes"
                        checked={wantToUpdateCategory === true}
                        onChange={() => setWantToUpdateCategory(true)}
                      />
                      <Form.Check
                        type="radio"
                        label="No"
                        checked={wantToUpdateCategory === false}
                        onChange={() => setWantToUpdateCategory(false)}
                      />
                    </div>
                    <Form.Select
                      hidden={!wantToUpdateCategory}
                      className="mt-2"
                      onChange={(event) =>
                        setSelectedCategory({
                          ...selectedCategory,
                          categoryId: event.target.value,
                        })
                      }
                    >
                      {/* <option value="none">None</option> */}
                      {allCategories &&
                        allCategories.content.map((cat) => (
                          <option
                            key={cat.categoryId}
                            selected={
                              cat.categoryId ===
                              productToUpdate.category.categoryId
                            }
                            value={cat.categoryId}
                          >
                            {cat.title}
                          </option>
                        ))}
                    </Form.Select>
                    <Container
                      className="text-center mt-4"
                      hidden={!wantToUpdateCategory}
                    >
                      <Button
                        variant="success"
                        className="me-3 px-4"
                        onClick={handleCategoryOfProd}
                      >
                        Update Category
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setWantToUpdateCategory(false)}
                      >
                        Cancel
                      </Button>
                    </Container>
                  </FormGroup>
                  <Container className="text-center mt-4">
                    <Button
                      variant="success"
                      type="submit"
                      className="me-3 px-4"
                    >
                      Submit
                    </Button>
                    <Button variant="secondary" onClick={handleCloseOfUpdate}>
                      Cancel
                    </Button>
                  </Container>
                </Form>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const handleChangeToUpdateProd = (event) => {
    const { name, value } = event.target;
    console.log(`name is ${name} and value is ${value}`);

    if (name === "discountedPrice") {
      if (parseFloat(value) > parseFloat(productToUpdate.price)) {
        toast.error("Discounted Price Can't Be Greater Than Actual Price");
        return;
      }
    }
    setProductToUpdate({ ...productToUpdate, [name]: value });
  };

  const handleSubmitToUpdateProd = (event) => {
    event.preventDefault();
    console.log("Final Updated Product is " + JSON.stringify(productToUpdate));
    if (updatedProdImg.status === false) {
      toast.error("Please Upload Image First");

      return;
    }

    console.log("Want To Update Category " + wantToUpdateCategory);

    if (
      wantToUpdateCategory !== null &&
      wantToUpdateCategory !== undefined &&
      wantToUpdateCategory === true
    ) {
      console.log("Status Update Category " + selectedCategory.status);
      if (
        selectedCategory.status === null ||
        selectedCategory.status === false
      ) {
        toast.error(
          "You Can't Directly Submit The Form Until You Click On UpdateCategory Button"
        );
        return;
      }
    }

    if (productToUpdate.price < 0 || productToUpdate.discountedPrice < 0) {
      toast.error("Price Can't Be Negative");
      return;
    }

    updateProductService(productToUpdate, updatedProdImg.file)
      .then((data) => {
        toast.success("Product Updated Successfully");

        // setListOfProduct((prevProd) =>
        //   prevProd.map((prod) =>
        //     prod.productId === productToUpdate.productId
        //       ? { ...prevProd, ...productToUpdate }
        //       : prod
        //   )
        // );

        setListOfProduct((prevProd) =>
          prevProd.map((prod) =>
            prod.productId === data.productId ? { ...prevProd, ...data } : prod
          )
        );
        setShowOfUpdate(false);
      })
      .catch((error) => {
        toast.error("Error Occur While Updating Product");
      });
  };

  const uploadUpdatedProdImg = () => {
    console.log("Product Id " + productToUpdate.productId);
    uploadProductImageService(productToUpdate.productId, updatedProdImg.file)
      .then((data) => {
        toast.success("Image Updated Successfully");
        setUpdatedProdImg({
          ...updatedProdImg,
          status: true,
        });
        setProductToUpdate({
          ...productToUpdate,
          productImage: data.data.fileName,
        });
        // console.log("Response From Prod Update Img " + data.data.fileName);
        // console.log("Value of Prod " + JSON.stringify(productToUpdate));
        // console.log("Response from Update Img api " + JSON.stringify(data));
        // console.log("Value of Prod after" + JSON.stringify(productToUpdate));
      })
      .catch((error) => {
        toast.error("Something Went Wrong While Updating Product Image");
        setUpdatedProdImg({
          ...updatedProdImg,
          status: false,
        });
      });
  };
  const handlUpdateProductImg = (event) => {
    const localfile = event.target.files[0];
    console.log(localfile);
    if (!localfile.type?.includes("image")) {
      toast.error("Please Upload either jpg or jpeg or png file");
    } else {
      const reader = new FileReader();
      reader.onload = (r) => {
        // console.log("Image Inside Reader " + r);
        setUpdatedProdImg({
          placeholder: r.target.result,
          file: localfile,
        });
      };
      reader.readAsDataURL(localfile);
    }
  };

  const handleCategoryOfProd = () => {
    // console.log("Selected Category " + JSON.stringify(selectedCategory));
    // console.log("Selected Product " + JSON.stringify(productToUpdate));
    if (wantToUpdateCategory != null && wantToUpdateCategory == true) {
      updateCategoryOfProdService(
        selectedCategory.categoryId,
        productToUpdate.productId
      )
        .then((data) => {
          toast.success("Category Updated Successfully");
          setSelectedCategory({ ...selectedCategory, status: true });
          console.log(
            "The Value of Prod in Category Update " +
              JSON.stringify(productToUpdate)
          );
          console.log(
            "The Response from Category Update " + JSON.stringify(data)
          );

          setProductToUpdate({
            ...productToUpdate,
            productImage: data.productImage,
          });
        })
        .catch((error) => {
          toast.error("Something Went Wrong While Updating Category");
          setSelectedCategory({ ...selectedCategory, status: false });
        });
    }
  };

  //Search Functionality Implementation
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() != "") {
        searchProductService(query)
          .then((data) => {
            // setSearchProduct(data.content);
            setListOfProduct(data.content);
            setTotalPages(data.totalPages);
            // console.log("Value of Total Page inside delayBounce " + totalPages);
            // console.log("Debounce Function output " + JSON.stringify(data));
          })
          .catch((error) => {
            toast.error("Error Occur While Searching Product");
          });
      }
    }, 100);
    return () => clearTimeout(delayDebounce);
  }, [query]);
  const viewTable = () => {
    return (
      <Container>
        <Row>
          <Col>
            <Card className="shadow rounded-4 border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-primary m-0">
                    Product Inventory
                  </h3>
                  <Form
                    style={{
                      maxWidth: "300px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <InputGroup>
                      <Form.Control
                        type="search"
                        placeholder="Search products..."
                        aria-label="Search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <Button variant="outline-secondary">Search</Button>
                    </InputGroup>
                  </Form>
                </div>
                <Table
                  bordered
                  hover
                  responsive
                  className="align-middle text-center table-striped"
                >
                  <thead className="table-dark">
                    <tr>
                      <th>Sr.No</th>
                      <th>Title</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Discounted Price</th>
                      <th>Live</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log(JSON.stringify(products))} */}
                    {listOfProduct.map((prod, index) => (
                      <tr>
                        <td>{(currentPage - 1) * pageSize + (index + 1)}</td>
                        <td>{prod.title}</td>
                        <td>{prod.quantity}</td>
                        <td>₹{prod.price}</td>
                        <td>₹{prod.discountedPrice}</td>
                        <td>
                          {prod.live ? (
                            <span className="badge bg-success">Yes</span>
                          ) : (
                            <span className="badge bg-danger">No</span>
                          )}
                        </td>
                        <td>
                          {prod.stock ? (
                            <span className="badge bg-success">Yes</span>
                          ) : (
                            <span className="badge bg-danger">No</span>
                          )}
                        </td>
                        <td>
                          {prod.category === null ||
                          prod.category.title === undefined ||
                          prod.category.title === null ? (
                            <span>NA</span>
                          ) : (
                            prod.category.title
                          )}
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <Button
                              variant="info"
                              size="sm"
                              onClick={(event) => handleShowOfProduct(prod)}
                            >
                              View
                            </Button>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={(event) =>
                                handleShowForUpdateModal(prod)
                              }
                            >
                              Update
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(event) =>
                                // console.log(JSON.stringify(prod))
                                deleteProducts(prod.productId)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* Pagination at Bottom */}
                <div className="d-flex justify-content-end mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage == 1}
                    />
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {show && viewIndividualProd(productToView)}
        {showOfUpdate && productToUpdateModal(productToUpdate)}
      </Container>
    );
  };
  // return listOfProduct.length > 0 ? (
  //   viewTable()
  // ) : (
  //   <h5>No Produts Found !!!!</h5>
  // );
  return viewTable();
};

export default ViewProducts;
