import { Outlet } from "react-router-dom";
import useJwtTokenExpire from "../CustomHooks/useJwtTokenExpire";

const PrivateRoute = ({ children }) => {
  // const jwtTokenExpire = useJwtTokenExpire();
  // if (jwtTokenExpire) {
  //   return;
  // }
  // const { login, userData, logoutFun } = useContext(UserContext);

  // const isJwtExpired = localStorage.getItem("userData");
  // console.log("Is Jwt Expired " + isJwtExpired);
  // // console.log(
  // //   // "User Context inside Private Route " + JSON.stringify(usrContext)
  // // );
  // // const { login, userData } = usrContext;
  // if (isJwtExpired === null || userData === null || !login) {
  //   logoutFun();
  //   return <Navigate to="/" replace />;
  // }
  return <Outlet />;
};

export default PrivateRoute;
