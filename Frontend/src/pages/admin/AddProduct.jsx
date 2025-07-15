import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Form,
  FormGroup,
  Button,
  Row,
  Col,
  InputGroup,
  FormLabel,
  Container,
} from "react-bootstrap";
import defaultProductImg from "../../asset/profile.jpg";
import { toast } from "react-toastify";
import {
  addProductWithCategory,
  addProductWithoutCategory,
} from "../../Services/productService";
import { getAllCategory } from "../../Services/categoryService";
import Select from "react-select";
import { Editor } from "@tinymce/tinymce-react";
const AddProduct = () => {
  //for editor
  const editorRef = useRef(null);
  //Use Effect To Load Categories on Page
  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [menuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    getAllCategory(0, 10000)
      .then((data) => {
        console.log(JSON.stringify(data.content));

        //Here We Need to Modify The Category Because React-Select Requires label and Value
        if (data?.content) {
          const formattedCategory = data.content.map((cat) => ({
            value: cat.categoryId,
            label: cat.title,
          }));
          setCategory(formattedCategory);
        }
        setCategoryLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed To Load Categories");
        setCategoryLoading(false);
        return;
      });
  }, []);

  const [productImage, setProductImage] = useState({
    placeholder: defaultProductImg,
    file: null,
  });

  const [product, setProduct] = useState({
    productId: "",
    title: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    quantity: 1,
    live: true,
    stock: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    // console.log(`The Field Name is ${name} and its value is ${value}`);
    // console.log(product);

    //This Block Is To Make Sure That Discounted Price Must Be Lesser Than Actual Price
    if (name === "discountedPrice") {
      // console.log("Product Price " + product.price);
      if (parseFloat(value) > parseFloat(product.price)) {
        toast.error("Discounted Price Can't Be Greater Than Actual Price");
        return;
      }
    }
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleReset = () => {
    setProduct({
      title: "",
      description: "",
      price: 0,
      discountedPrice: 0,
      quantity: 1,
      live: true,
      stock: true,
    });

    setProductImage({
      placeholder: defaultProductImg,
      file: null,
    });

    setSelectedCategory(null);
  };
  const formSubmit = (event) => {
    // console.log("Form Submit " + JSON.stringify(product));
    event.preventDefault();

    if (
      product.title.trim() === "" ||
      product.title === null ||
      product.title === undefined
    ) {
      toast.error("Product Title Cannot Be Empty");
      return;
    }
    if (
      product.description.trim() === "" ||
      product.description === null ||
      product.description === undefined
    ) {
      toast.error("Product Description Cannot Be Empty");
      return;
    }
    if (product.price === null || product.price === undefined) {
      toast.error("Please Enter Some Price");
      return;
    }

    if (product.price < 0) {
      toast.error("The Price Can't Be Negative");
      return;
    }
    if (
      product.discountedPrice === null ||
      product.discountedPrice === undefined
    ) {
      toast.error("Please Enter Discounted Price");
      return;
    }
    if (product.quantity === null || product.quantity === undefined) {
      toast.error("Please Enter Quantity");
      return;
    }

    if (productImage.file === null || productImage.file === undefined) {
      toast.error("Please Upload Image of Product");
      return;
    }

    if (selectedCategory === null || selectedCategory === undefined) {
      toast.error("Please Select Category Before Adding Product");
      return;
    }
    //This code from Line 145 to 153 is to add Product Without Category
    // addProductWithoutCategory(product, productImage.file)
    //   .then((data) => {
    //     toast.success("Product Added Successfully");
    //     handleReset();
    //   })
    //   .catch((error) => {
    //     console.log("Error While Adding Product is " + JSON.stringify(error));
    //     toast.error("Something Went Wrong While Adding ");
    //   });

    console.log(`Selected Category ${selectedCategory.value}`);
    addProductWithCategory(product, selectedCategory.value, productImage.file)
      .then((data) => {
        toast.success("Product Added Successfully");
        handleReset();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something Went Wrong While Adding Product");
      });
  };

  const handleProductImgChange = (event) => {
    const localFile = event.target.files[0];
    // console.log("The Product Image is " + JSON.stringify(productImage));

    if (!localFile.type.includes("image")) {
      toast.error("Please Upload either jpg or jpeg or png file");
    } else {
      const reader = new FileReader();
      reader.onload = (r) => {
        // console.log("Image Inside Reader " + r);
        setProductImage({
          placeholder: r.target.result,
          file: localFile,
        });
      };
      reader.readAsDataURL(localFile);
      // console.log("The Product Image is 2 " + JSON.stringify(productImage));
    }
  };
  const formView = () => {
    return (
      <>
        <Card className="p-4">
          <Card.Body>
            <h3 className="text-center mb-4">Add Product</h3>
            <Form onSubmit={formSubmit}>
              {/* Title */}
              <FormGroup className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Enter product title"
                  value={product.title}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* Description */}
              <FormGroup className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter product description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                />
              </FormGroup>

              <Row>
                <Col>
                  {/* Price */}
                  <FormGroup className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  {" "}
                  {/* Discounted Price */}
                  <FormGroup className="mb-3">
                    <Form.Label>Discounted Price</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Enter discounted price"
                      name="discountedPrice"
                      value={product.discountedPrice}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {/* Quantity */}
              <FormGroup className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter quantity"
                  min="1"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* Is Product Live */}
              <FormGroup className="mb-3">
                <Form.Label>Is Product Live?</Form.Label>
                <div>
                  {/* <Form.Check
                  type="switch"
                  id="isLive"
                  onChange={null}
                  checked={null}
                  label="Live"
                /> */}
                  <Form.Check
                    type="radio"
                    name="live"
                    label="Yes"
                    value="true"
                    onChange={() => {
                      setProduct((prevProduct) => {
                        const updatedProduct = { ...prevProduct, live: true };
                        console.log(
                          "Updated Product:",
                          JSON.stringify(updatedProduct)
                        );
                        return updatedProduct;
                      });
                    }}
                    checked={product.live === true}
                    inline
                  />
                  <Form.Check
                    type="radio"
                    name="live"
                    label="No"
                    value="false"
                    onChange={() => {
                      setProduct((prevProduct) => {
                        const updatedProduct = {
                          ...prevProduct,
                          live: false,
                        };
                        console.log(
                          "Updated Product:",
                          JSON.stringify(updatedProduct)
                        );
                        return updatedProduct;
                      });
                    }}
                    checked={product.live === false}
                    inline
                  />
                </div>
              </FormGroup>
              <Container
                hidden={productImage.file === null}
                className="text-center"
              >
                <img
                  src={productImage.placeholder}
                  alt=""
                  // height={200}
                  // className="rounded-square border shadow-sm m-2"
                  className="img-fluid"
                  style={{
                    // width: "100%",
                    // height: "120px",
                    // objectFit: "cover",
                    maxHeight: "250px",
                  }}
                />
                <p className="text-muted">Image Preview</p>
              </Container>
              <FormGroup>
                <FormLabel>Please Upload The Product Image</FormLabel>
                <InputGroup>
                  <Form.Control type="file" onChange={handleProductImgChange} />
                  <Button
                    variant="danger"
                    onClick={() =>
                      setProductImage({
                        placeholder: defaultProductImg,
                        file: null,
                      })
                    }
                  >
                    Clear
                  </Button>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <FormLabel className="mt-3">
                  Please Select The Category In Which You Want To Place Product
                </FormLabel>
                <Select
                  options={category}
                  isLoading={categoryLoading}
                  placeholder="Search or select category"
                  isSearchable
                  defaultValue={category.slice(0, 5)} // Show first 5 categories initially
                  menuOpen={menuOpen}
                  onMenuOpen={() => setIsMenuOpen(true)}
                  onMenuClose={() => setIsMenuOpen(false)}
                  onChange={(select) => {
                    setSelectedCategory(select);
                    setIsMenuOpen(false);
                  }}
                  value={selectedCategory}
                />
              </FormGroup>
              {/* Submit Button */}
              <Container className="text-center mt-3">
                <Button variant="success" type="submit" className="me-2">
                  Submit
                </Button>
                <Button variant="danger" onClick={handleReset}>
                  Clear
                </Button>
              </Container>
            </Form>
          </Card.Body>
        </Card>
      </>
    );
  };
  return <div>{formView()}</div>;
};

export default AddProduct;
