import { privateAxios } from "./axiosService";

export const getCartOfUserService = async (userId) => {
  let result = await privateAxios.get(`/cart/${userId}`);
  return result.data;
};

export const addItemToCartService = async (userId, productId, quantity) => {
  const result = await privateAxios.post(`/cart/${userId}`, {
    productId,
    quantity,
  }); //This is feature of javascript here it directly creates and object with given key and there respective value
  return result.data;
};

export const deleteWholeCartService = async (userId) => {
  const result = await privateAxios.delete(`/cart/${userId}`);
  return result.data;
};

export const removeItemsFromCartService = async (userId, cartItemId) => {
  const result = await privateAxios.put(`/cart/items/${userId}/${cartItemId}`);
  return result.data;
};
