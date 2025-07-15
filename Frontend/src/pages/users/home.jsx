import React, { useContext } from "react";
import UserContext from "../../context/userContext";

const Home = () => {
  const userContext = useContext(UserContext);
  console.log(JSON.stringify(userContext));
  return (
    <div>
      <h1>This is Home Welcome {userContext?.userData?.user?.name}</h1>
      <h1>Is User Login {String(userContext?.login)}</h1>
    </div>
  );
};

export default Home;
