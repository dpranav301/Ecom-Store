import React, { useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  FormGroup,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { addCategory, uploadCategoryImg } from "../../Services/categoryService";
import defaultProfile from "../../logo.svg";
const AddCategories = () => {
  const [categoryDto, setCategoryDto] = useState({
    title: "",
    description: "",
    coverImage: "",
  });

  const [loading, setLoading] = useState(false);

  const resetData = () => {
    setCategoryDto({
      title: "",
      description: "",
      coverImage: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(categoryDto);
    setCategoryDto({
      ...categoryDto,
      [name]: value,
    });
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (
      categoryDto.title === null ||
      categoryDto.title === undefined ||
      categoryDto.title.trim() === ""
    ) {
      toast.error("Category Title Cannot Be Empty");
      return;
    }
    if (
      categoryDto.description === null ||
      categoryDto.description === undefined ||
      categoryDto.description.trim() === ""
    ) {
      toast.error("Category Description Cannot Be Empty");
      return;
    }
    if (previewImg.file === null) {
      toast.error("Please Upload Category Image");
      return;
    }
    setLoading(true);
    addCategory(categoryDto)
      .then((data) => {
        console.log("Response From Category API " + JSON.stringify(data));
        toast.success("Category Created Successfully");
        uploadCategoryImg(previewImg.file, data.categoryId)
          .then((data) => {
            console.log("Response From Category Img Upload API " + data);
            toast.success("Category Image Uploaded Succesfully");
          })
          .catch((error) => {
            toast.error("Error Occurred While Uploading Category Img");
          });
      })
      .catch((error) => {
        console.log("Error From Category API " + error);
        toast.error(
          error?.response?.data?.message == null
            ? "Error While Creating Category"
            : error?.response?.data?.message
        );
      })
      .finally(() => {
        setLoading(false);
        resetData();
      });
  };

  const [previewImg, setPreviewImg] = useState({
    placeholder: defaultProfile,
    file: null,
  });

  const handleCategoryImg = (event) => {
    const localFile = event.target.files[0];
    console.log("LocalFile is " + JSON.stringify(localFile));
    console.log(previewImg);
    if (localFile.type === "application/pdf") {
      toast.error("Please Select Img file");
      setPreviewImg({
        placeholder: defaultProfile,
        file: null,
      });
    } else {
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
  return (
    <div>
      <Container>
        <Card>
          <Card.Body>
            <h5>Add Catgeorry</h5>
            <Form onSubmit={submitForm}>
              <FormGroup>
                <Form.Label>Category Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name Of Category"
                  value={categoryDto.title}
                  onChange={handleChange}
                  name="title"
                />
              </FormGroup>

              <FormGroup>
                <Form.Label>Category Description</Form.Label>
                <Form.Control
                  rows={3}
                  as={"textarea"}
                  placeholder="Enter Description Of Category"
                  value={categoryDto.description}
                  onChange={handleChange}
                  name="description"
                />
              </FormGroup>

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
              <FormGroup>
                <Form.Label>Please Upload Category Image</Form.Label>
                <InputGroup>
                  <Form.Control type="file" onChange={handleCategoryImg} />
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
              </FormGroup>

              <Container>
                <div className="text-center mt-2">
                  <Button variant="success" type="submit" disabled={loading}>
                    {/* Add Category */}
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                      hidden={!loading}
                    />
                    <span hidden={!loading}>Wait..</span>
                    <span hidden={loading}>Add Category</span>
                  </Button>
                  <Button variant="danger" className="ms-2" onClick={resetData}>
                    Clear
                  </Button>
                </div>
              </Container>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AddCategories;
