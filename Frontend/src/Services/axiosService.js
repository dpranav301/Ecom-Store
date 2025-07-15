import axios from "axios";
import { BASE_URL } from "./helperService";
import { getJwtTokenFromLocalStorage } from "../storage/sessionStorageHelper";

//We Will Create Two Axios Object One to call public API and Another Axios To Call Private API
export const publicAxios = axios.create({
  baseURL: BASE_URL,
});

//axios to call private API
export const privateAxios = axios.create({
  baseURL: BASE_URL,
});

//To Add Jwt token in request we use axios interceptor

privateAxios.interceptors.request.use(
  (config) => {
    const token = getJwtTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
