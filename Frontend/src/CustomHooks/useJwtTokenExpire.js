import React, { useEffect, useState } from "react";
import { getJwtTokenFromLocalStorage } from "../storage/sessionStorageHelper";
import { isJwtExpired } from "jwt-check-expiration";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useJwtTokenExpire = () => {
  const navigate = useNavigate();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const jwtToken = getJwtTokenFromLocalStorage();
    const isExpired = isJwtExpired(jwtToken);

    if (isExpired) {
      setExpired(true);
      toast.error("Please Login Again");
      navigate("/login");
      return;
    }
  }, [navigate]);

  return expired;
};

export default useJwtTokenExpire;
