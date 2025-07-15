import { privateAxios, publicAxios } from "./axiosService";

//get All Orders

export const getAllOrderService = async (pageNumber = 0, pageSize = 10) => {
  let result = await privateAxios.get(
    `/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  //   console.log("Data Inside orderService " + JSON.stringify(result.data));
  return result.data;
};
//update Order

export const updateOrderService = async (order) => {
  let result = await privateAxios.put(`/orders/${order.orderId}`, order);
  return result.data;
};

//Search Order By OrderId

export const searchOrderService = async (currentPage, query) => {
  let result = await privateAxios.get(
    `/orders/search/${query}?pageNumber=${currentPage}`
  );
  console.log("Result of Search with query=" + query, JSON.stringify(result));
  return result.data;
};
//Create order of user

export const createOrderService = async (userId, orderDto) => {
  let result = await privateAxios.post(`/orders/${userId}`, orderDto);
  return result.data;
};

//Get Orders of Single User

export const getOrdersOfUserService = async (
  userId,
  pageNumber = 0,
  pageSize = 10
) => {
  let result = await privateAxios.get(
    `/orders/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result.data;
};
