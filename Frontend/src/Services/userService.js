//This Service Will Contain All The Services Releated To User Like That We Will Have Different Service for Different Cases(Means Here We Will Call All The API releated to User)

//register new User
import { publicAxios, privateAxios } from "./axiosService";
import { USER_PAGE_SIZE } from "./helperService";
export const registerUser = (userData) => {
  //This userData is an json Obj Which will be pass to backend
  return publicAxios.post(`/user`, userData).then((response) => response.data);
};

export const loginUser = (userData) => {
  return publicAxios
    .post(`/auth/generate-token`, userData)
    .then((response) => response.data);
};

export const getUser = (userId) => {
  return publicAxios.get(`/user/${userId}`).then((response) => response.data);
};

//update user

export const updateUser = (user) => {
  return privateAxios
    .put(`/user/${user.userId}`, user)
    .then((response) => response.data);
};

//update user profile picture

export const updateUserProfileImg = (file, userId) => {
  if (file != null) {
    const formData = new FormData();
    formData.append("userImage", file);
    return privateAxios
      .post(`/user/image/${userId}`, formData)
      .then((response) => response.data);
  } else {
    return;
  }
};

//get All Users

export const getAllUserService = async (
  pageNumber = 0,
  pageSize = USER_PAGE_SIZE
) => {
  let result = await privateAxios.get(
    `/user?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result.data;
};

//search User

export const searchUserService = async (currentPage, query) => {
  let result = await privateAxios.get(
    `/user/search/${query}?pageNumber=${currentPage}`
  );
  return result.data;
};
