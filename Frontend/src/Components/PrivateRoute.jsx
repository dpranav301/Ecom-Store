import { Navigate, Outlet } from "react-router-dom";
import useJwtTokenExpire from "../CustomHooks/useJwtTokenExpire";
import { useContext } from "react";
import UserContext from "../context/userContext";

const PrivateRoute = ({ children }) => {
  // const jwtTokenExpire = useJwtTokenExpire();
  // if (jwtTokenExpire) {
  //   return;
  // }
  const jwtTokenExpired=useJwtTokenExpire();
 
  const { login, userData, logoutFun } = useContext(UserContext);

  const isJwtExpired = localStorage.getItem("userData");
  console.log("Is Jwt Expired " + isJwtExpired);
  // console.log(
  //   // "User Context inside Private Route " + JSON.stringify(usrContext)
  // );
  // const { login, userData } = usrContext;
  if(jwtTokenExpired!=null && jwtTokenExpired==true){
    logoutFun();
    return <Navigate to="/login" replace />;
  }
  if ((isJwtExpired === null || userData === null || !login)) {
    logoutFun();
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;
