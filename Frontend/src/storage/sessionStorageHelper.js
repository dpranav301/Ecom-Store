//this file contains all the operation releated to data of local storage

//This Function will save userData in LocalStorage
export const saveAllUserDataInLocalStorage = (data) => {
  localStorage.setItem("userData", JSON.stringify(data));
};
//This Function Will Save All The Data Releated to user in Local Storage
export const getAllUserDataFromLocalStorage = () => {
  const data = localStorage.getItem("userData");
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return null;
  }
};
//This Function is Use to Remove data from localStorage
export const doLogoutFromLocalStorage = () => {
  localStorage.removeItem("userData");
};

//This Function Will Get User From Local Storage
export const getUserFromLocalStorageData = () => {
  const data = getAllUserDataFromLocalStorage();
  if (data !== null) {
    return data;
  } else {
    return null;
  }
};
//This Function Will Get jwt token from Local Storage
export const getJwtTokenFromLocalStorage = () => {
  const data = getAllUserDataFromLocalStorage();
  if (data !== null) {
    // const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    // const expiryTime = payload.exp * 1000; // Convert to milliseconds
    // if (expiryTime < Date.now()) {
    //   doLogoutFromLocalStorage();
    // } else {
    //   return jwtToken;
    // }

    const jwtToken = data.token;
    return jwtToken;
  } else {
    return null;
  }
};

//This Function is For Finding Whther User is LoggedIn or not
export const isLoggedIn = () => {
  if (getJwtTokenFromLocalStorage()) {
    return true;
  } else {
    return false;
  }
};

export const isLoginUserIsAdmin = () => {
  if (!isLoggedIn()) {
    return null;
  } else {
    const getUser = getUserFromLocalStorageData().user;
    const role = getUser.roles.some((x) => x.roleName === "ROLE_ADMIN");
    return role;
  }
};
