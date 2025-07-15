import { privateAxios, publicAxios } from "./axiosService";

export const addCategory = (categoryDto) => {
  return privateAxios
    .post(`/category`, categoryDto)
    .then((response) => response.data);
};

export const getAllCategory = (currentPage = 0, pageSize = 5) => {
  return publicAxios
    .get(`/category?pageNumber=${currentPage}&pageSize=${pageSize}`)
    .then((response) => response.data);
};

export const deleteCategory = (categoryId) => {
  return privateAxios
    .delete(`/category/${categoryId}`)
    .then((response) => response.data);
};

export const updateCategory = (category, categoryId) => {
  return privateAxios
    .put(`/category/${categoryId}`, category)
    .then((response) => response.data);
};

export const uploadCategoryImg = (file, categoryId) => {
  if (file != null) {
    const formData = new FormData();
    formData.append("categoryImage", file);
    return privateAxios
      .post(`/category/image/${categoryId}`, formData)
      .then((response) => response.data);
  } else {
    return;
  }
};
