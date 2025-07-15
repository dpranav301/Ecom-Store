import { publicAxios, privateAxios } from "./axiosService";

// export const addProduct
export const addProductWithoutCategory = (product, file) => {
  const formData = new FormData();
  formData.append("productImageFile", file);
  Object.keys(product).forEach((key) => {
    formData.append(key, product[key]); // Add product fields
  });
  return privateAxios
    .post(`/products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
};

export const uploadProductImageService = (productId, file) => {
  const formData = new FormData();
  formData.append("productImage", file);
  return privateAxios.post(`/products/image/${productId}`, formData);
};

//create Product With Category

export const addProductWithCategory = (product, categoryId, file) => {
  const formData = new FormData();
  formData.append("productImageFile", file);
  Object.keys(product).forEach((key) => {
    formData.append(key, product[key]);
  });

  return privateAxios
    .post(`category/${categoryId}/product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

//Fetch Product From DB

export const fetchAllProduct = (pageNumber = 0, pageSize = 5) => {
  return privateAxios
    .get(`/products?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    .then((response) => response.data);
};

//Delete Product From DB

export const deleteProduct = (productId) => {
  return privateAxios
    .delete(`/products/${productId}`)
    .then((response) => response.data);
};

//Update Individual Product
export const updateProductService = (product) => {
  return privateAxios
    .put(`/products/${product.productId}`, product)
    .then((response) => response.data);
};

//update The Category of Product
export const updateCategoryOfProdService = (categoryId, productId) => {
  return privateAxios
    .put(`/category/${categoryId}/product/${productId}`)
    .then((response) => response.data);
};

export const searchProductService = (query, pageNumber = 0, pageSize = 20) => {
  return privateAxios(
    `/products/search/${query}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  ).then((response) => response.data);
};

export const getSingleProductDetailService = async (productId) => {
  let result = await privateAxios.get(`/products/${productId}`);
  return result.data;
};

//Get All Products With Category

export const getProductsWithCategory = async (
  categoryId,
  pageNumber = 0,
  pageSize = 5
) => {
  let result = await privateAxios.get(
    `/category/products/${categoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result.data;
};
