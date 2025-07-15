import React, { useEffect, useState } from "react";
import CategoryView from "../CategoryView";
import {
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../../Services/categoryService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Button, Modal, Container, Form, FormGroup } from "react-bootstrap";
import { RiseLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroll-component";

const ViewCatgoeries = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryObj, setCategoryObj] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  //Modal Releated Variable
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState({
    title: "",
    description: "",
    coverImage: "",
  });
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShowForCategoryUpdateForm = (categoryDetails) => {
    // console.log(
    //   "Props from Children Category " + JSON.stringify(categoryDetails)
    // );
    setShow(true);
    setCategoryToUpdate(categoryDetails);
    setUpdatedCategory(categoryDetails);
  };
  const handleChangeOfCategory = (event) => {
    const { name, value } = event.target;
    // console.log("Category To Update Befor " + JSON.stringify(categoryToUpdate));
    setUpdatedCategory({
      ...updatedCategory,
      [name]: value,
    });
    // console.log("Category To Update After " + JSON.stringify(categoryToUpdate));
  };

  const submitForm = (event) => {
    event.preventDefault();
    updateCategory(updatedCategory, updatedCategory.categoryId)
      .then((data) => {
        toast.success("Category Updated Successfully");
        setCategories((previousCategory) =>
          previousCategory.map((category) =>
            category.categoryId === updatedCategory.categoryId
              ? { ...category, ...updatedCategory } // 🔹 Update only the matched category
              : category
          )
        );
      })
      .catch((error) => {
        toast.error("Error Occurred While Updataing Category");
      })
      .finally(() => {
        setShow(false);
      });
  };
  const getAllCategoryAPI = (currentPage) => {
    getAllCategory(currentPage)
      .then((data) => {
        console.log(JSON.stringify(data));
        setCategoryObj({ ...categoryObj, ...data });
        setCategories([...categories, ...data.content]);
      })
      .catch((error) => {
        toast.error("Error Occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const deleteCategoryFromMain = (categoryId) => {
    Swal.fire({
      title: "Want To Delete Category",
      text: "Once deleted, you will not be able to recover this category!",
      showCancelButton: true, // ✅ Enables the Cancel button
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleting category with ID:", categoryId);
        deleteCategory(categoryId)
          .then((data) => {
            //This Code from line 35 to 40 is called as Functional Update it is new feature of useState
            setCategories((previousCategory) =>
              previousCategory.filter(
                (category) => category.categoryId !== categoryId
              )
            );
            Swal.fire("Deleted!", "The category has been deleted.", "success");
          })
          .catch((error) => {
            toast.error("Error While Deleting Category");
          });
      }
    });
  };
  const updateCategoryFuncFromMain = (categoryToUpdate) => {
    return (
      <>
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h3>Form To Update Category</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitForm}>
              <FormGroup>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={categoryToUpdate.title}
                  name="title"
                  onChange={handleChangeOfCategory}
                />
              </FormGroup>

              <FormGroup>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="textarea"
                  placeholder={categoryToUpdate.description}
                  name="description"
                  onChange={handleChangeOfCategory}
                />
              </FormGroup>

              <FormGroup>
                <Form.Label>CoverImage</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={categoryToUpdate.coverImage}
                  name="coverImage"
                  onChange={handleChangeOfCategory}
                />
              </FormGroup>
              <Container className="text-center mt-2 ">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="me-2"
                >
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Container>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const loadNextPageOfCategory = () => {
    setCurrentPage(currentPage + 1);
    console.log("Current Page " + currentPage);
  };
  useEffect(() => {
    getAllCategoryAPI(currentPage);
  }, [currentPage]);
  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }} // Full viewport height
        >
          <div className="text-center">
            {/* <Spinner /> */}
            <RiseLoader />
            <h5>Loading</h5>
          </div>
        </div>
      ) : (
        <>
          {categories.length > 0 ? (
            <>
              <InfiniteScroll
                dataLength={categoryObj.content.length}
                hasMore={!categoryObj.lastpage}
                loader={<h2>Loading...</h2>}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
                next={loadNextPageOfCategory}
              >
                {categories.map((category, index) => (
                  <CategoryView
                    key={index}
                    category={category}
                    deleteCategoryFromMainFunc={deleteCategoryFromMain}
                    handleShowForCategoryUpdateForm={
                      handleShowForCategoryUpdateForm
                    }
                  />
                ))}
              </InfiniteScroll>
            </>
          ) : (
            <h5>No Categories</h5>
          )}
        </>
      )}
      {show && updateCategoryFuncFromMain(categoryToUpdate)}
    </>
  );
};

export default ViewCatgoeries;
