//This file is provider for userContext

import { useEffect, useState } from "react";
import UserContext from "./userContext";
import {
  doLogoutFromLocalStorage,
  getAllUserDataFromLocalStorage,
  getUserFromLocalStorageData,
  isLoggedIn,
  isLoginUserIsAdmin,
  saveAllUserDataInLocalStorage,
} from "../storage/sessionStorageHelper";

const UserProvider = ({ children }) => {
  const [login, setIsLogin] = useState(isLoggedIn());
  const [userData, setUserData] = useState(getUserFromLocalStorageData());
  const [isAdminUser, setAdminUser] = useState(false);
  // console.log("Children are", children);
  useEffect(() => {
    setIsLogin(isLoggedIn());
    setUserData(getUserFromLocalStorageData());
    setAdminUser(isLoginUserIsAdmin());
  }, []);
  const doLogin = (data) => {
    console.log("do Login Function Call", JSON.stringify(data));
    saveAllUserDataInLocalStorage(data);
    setIsLogin(true);
    setUserData(getAllUserDataFromLocalStorage());
    setAdminUser(isLoginUserIsAdmin());
  };

  const doLogout = () => {
    doLogoutFromLocalStorage();
    setIsLogin(false);
    setUserData(null);
    setAdminUser(false);
  };

  //This If Else is for saving Data in Local Storage

  return (
    <UserContext.Provider
      value={{
        login,
        userData,
        isAdminUser,
        loginFun: doLogin,
        logoutFun: doLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
