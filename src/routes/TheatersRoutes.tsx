import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { TheatersHome, TheatersLogin, TheatersSignUp } from '../pages/theaters'
import { TheaterOTPVerification } from "../pages/theaters/theaterOTPVerifiy";
import { useLoggedOwner } from "../hooks/useLoggedUser";
import { Loader } from "../component/Loader";


const UserRoutes: React.FC = () => {
  const { loading } = useLoggedOwner('theater');
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (loading) {
      // Show loader immediately
      setShowLoader(true);

      // Set timeout to hide loader after 2 seconds
      timer = setTimeout(() => {
        setShowLoader(false);
      }, 2000);
    } else {
      // Cancel timeout and hide loader
      if (timer) {
        clearTimeout(timer);
      }
      setShowLoader(false);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [loading]);

  return (
    <>
      {showLoader && <Loader />}
      <Routes>
        <Route path='/home' element={<TheatersHome />} />
        <Route path='/login' element={<TheatersLogin />} />
        <Route path='/signup' element={<TheatersSignUp />} />
        <Route path='/otp-verification' element={<TheaterOTPVerification />} />
      </Routes>

    </>
  )
}


export default UserRoutes

