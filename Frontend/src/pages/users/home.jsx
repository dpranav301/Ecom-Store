// import React, { useContext } from "react";
// import UserContext from "../../context/userContext";

// const Home = () => {
//   const userContext = useContext(UserContext);
//   console.log(JSON.stringify(userContext));
//   return (
//     <div>
//       <h1>This is Home Welcome {userContext?.userData?.user?.name}</h1>
//       <h1>Is User Login {String(userContext?.login)}</h1>
//     </div>
//   );
// };

// export default Home;

import {React,useContext, useEffect, useState} from 'react';
import { Container, Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import defaultProfile from './../../asset/profile.jpg' // Default profile image
import UserContext from '../../context/userContext';
import useJwtTokenExpire from '../../CustomHooks/useJwtTokenExpire';
import { BASE_URL } from '../../Services/helperService';

const Home = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const[user,setUser]=useState(null);
  const{userData}=userContext;
 
  useEffect(()=>{
    if(userData!=null){
    setUser(userData?.user)
  }
  },[userData])
   const jwtTokenExpire=useJwtTokenExpire();
  if(jwtTokenExpire){
    console.log("JWT Token Expire")
  }

  const handleGoToStore = () => {
    navigate('/store'); // Replace with your actual store route
  };

  const imageUrl = user?.imageName
    ? `${BASE_URL}/user/image/${user?.userId}`
    : defaultProfile;
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card className="text-center shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-3">Welcome {user?.name}</h2>
        
        <Image
          src={imageUrl}
          roundedCircle
          width={120}
          height={120}
          className="mb-4 mx-auto"
        />

        <Button variant="primary" onClick={handleGoToStore}>
          Go to Store
        </Button>
      </Card>
    </Container>
  );
};

export default Home;

