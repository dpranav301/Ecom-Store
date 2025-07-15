import React from "react";
import { Outlet } from "react-router-dom";
import useJwtTokenExpire from "../../CustomHooks/useJwtTokenExpire";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";

function Dashboard() {
  const isJwtExpired = useJwtTokenExpire();
  if (isJwtExpired) {
    return;
  }
  // const userContext = useContext(UserContext);
  // const navigate = useNavigate();
  // const loginFirstWarningPage = () => {
  //   return (
  //     <div>
  //       <Card className="text-center">
  //         <Card.Body>
  //           <Card.Title>Please Login</Card.Title>
  //           <Button variant="primary" onClick={() => navigate("/login")}>
  //             Click To Login
  //           </Button>
  //         </Card.Body>
  //       </Card>
  //     </div>
  //   );
  // };
  const viewUserDashboard = () => {
    return (
      <div>
        <Outlet />
      </div>
    );
  };
  // return userContext.login ? viewUserDashboard() : <h1>You Are Not Login</h1>; this is method to the
  //this manages private routes
  // return userContext.login ? viewUserDashboard() : loginFirstWarningPage();
  // return userContext.login ? viewUserDashboard() : <Navigate to={"/login"} />;
  return viewUserDashboard();
}

export default Dashboard;
