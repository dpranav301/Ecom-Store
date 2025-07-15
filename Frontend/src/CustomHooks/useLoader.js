import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { privateAxios, publicAxios } from "../Services/axiosService";

const useLoader = () => {
  const [loading, setLoading] = useState(false);
  // const navi = useNavigate();
  useEffect(() => {
    // Private Request Interceptor
    privateAxios.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject("Some Error Occurred");
      }
    );

    //Private Response Interceptor
    privateAxios.interceptors.response.use(
      (config) => {
        setLoading(false);
        return config;
      },
      (error) => {
        setLoading(false);
        if (error.code === "ERR_NETWORK") {
          toast.error("There Is No Response");
          return;
        } else if (error.response && error.response.status === 404) {
          return;
        } else if (error.response && error.response.status === 401) {
          return;
        } else {
          toast.error("An unexpected error occurred");
        }
        return Promise.reject("Some Error");
      }
    );

    // Public Request Interceptor
    publicAxios.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject("Some Error Occurred");
      }
    );

    //Public Response Interceptor
    publicAxios.interceptors.response.use(
      (config) => {
        setLoading(false);
        return config;
      },
      (error) => {
        setLoading(false);
        if (error.code === "ERR_NETWORK") {
          toast.error("There Is No Response");
          return;
        } else if (error.response && error.response.status === 404) {
          return;
        } else if (error.response && error.response.status === 401) {
          return;
        } else {
          toast.error("An unexpected error occurred");
        }
        return Promise.reject(error);
      }
    );
  }, []);
  return loading;
};

export default useLoader;
