import React, { useEffect, useState } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { getAllCategory } from "../../Services/categoryService";
import { BASE_URL } from "../../Services/helperService";
import defaultPhoto from "../../asset/profile.jpg";
import {
  fetchAllProduct,
  getProductsWithCategory,
} from "../../Services/productService";
import SingleProductCard from "./SingleProductCard";
import InfiniteScroll from "react-infinite-scroll-component";

const Store = () => {
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadCategories();
    loadInitialProducts();
  }, []);

  const loadCategories = () => {
    getAllCategory(0, 100000)
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  };

  const loadInitialProducts = async () => {
    try {
      let data = await fetchAllProduct(0, 5);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadNextProduct = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    try {
      let data;

      if (currentCategory !== null) {
        data = await getProductsWithCategory(
          currentCategory.categoryId,
          nextPage,
          5
        );
      } else {
        data = await fetchAllProduct(nextPage, 5);
      }

      setProducts((prev) => ({
        ...data,
        content: [...(prev?.content || []), ...data.content],
      }));
    } catch (error) {
      console.error("Failed to load next page:", error);
    }
  };

  useEffect(() => {
    // Reset page and load fresh products when category changes
    setCurrentPage(0);

    const loadByCategory = async () => {
      try {
        let data;

        if (currentCategory !== null) {
          data = await getProductsWithCategory(
            currentCategory.categoryId,
            0,
            5
          );
        } else {
          data = await fetchAllProduct(0, 5);
        }

        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadByCategory();
  }, [currentCategory]);

  const productView = () => {
    if (products === null || products.content.length === 0) {
      return (
        <>
          <h3 className="fw-bold">
            <span className="text-decoration-none text-primary me-1">
              Store /
            </span>
            <span className="text-dark">{currentCategory?.title}</span>
          </h3>
          <h1 className="text-center mt-5 text-muted">
            No Products Present In This Category
          </h1>
        </>
      );
    }
    return (
      <Container fluid className="px-5 mt-3" style={{ overflowX: "hidden" }}>
        <Row className="fw-bold text-black text-truncate mb-3">
          {currentCategory === null ? (
            <h1>All Products</h1>
          ) : (
            <h3 className="fw-bold">
              <span className="text-decoration-none text-primary me-1">
                Store /
              </span>
              <span className="text-dark">{currentCategory?.title}</span>
            </h3>
          )}
        </Row>

        <InfiniteScroll
          dataLength={products.content.length}
          next={loadNextProduct}
          loader={<h5>Loading More Products...</h5>}
          hasMore={!products.lastpage}
        >
          <Container fluid>
            <Row>
              {products.content.map(
                (prod) =>
                  prod.live && (
                    <Col key={prod.productId} md={4}>
                      <SingleProductCard product={prod} />
                    </Col>
                  )
              )}
            </Row>
          </Container>
        </InfiniteScroll>
      </Container>
    );
  };

  const categoryView = () =>
    categories && (
      <ListGroup className="sticky-top bg-white shadow-sm rounded p-2">
        <h5 className="text-center text-primary fw-semibold mb-3">
          Categories
        </h5>

        <ListGroup.Item
          action
          className="d-flex align-items-center gap-3 p-2 rounded mb-2 border-0 shadow-sm"
          style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f8f9fa")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "white")
          }
          onClick={() => setCurrentCategory(null)}
        >
          <img
            src={defaultPhoto}
            alt="All Product"
            className="rounded"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            onError={(e) => e.currentTarget.setAttribute("src", defaultPhoto)}
          />
          <span className="fw-medium text-secondary">All Products</span>
        </ListGroup.Item>

        {categories.content.map((category) => (
          <ListGroup.Item
            action
            key={category.categoryId}
            className="d-flex align-items-center gap-3 p-2 rounded mb-2 border-0 shadow-sm"
            style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f8f9fa")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
            onClick={() => setCurrentCategory(category)}
          >
            <img
              src={`${BASE_URL}/category/image/${category.categoryId}`}
              alt={category.title}
              className="rounded"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
              onError={(e) => e.currentTarget.setAttribute("src", defaultPhoto)}
            />
            <span className="fw-medium text-secondary">{category.title}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );

  return (
    <Container fluid className="px-5 mt-3">
      <Row>
        <Col md={2}>{categoryView()}</Col>
        <Col md={10}>{productView()}</Col>
      </Row>
    </Container>
  );
};

export default Store;
