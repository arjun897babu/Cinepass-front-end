import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { UserHome, UserSignUp, UserLogin, UserOTPVerification } from '../pages/user'
import UserNavBar from "../component/user/UserNavBar";
import UserFooter from "../component/user/footer/UserFooter";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Loader } from "../component/Loader";
import { ProtectedRoutes } from "../component/user/ProtectedRoutes";

const UserRoutes: React.FC = () => {
  const location = useLocation();
  const { loading } = useSelector((state: RootState) => state.user)
  const isAuthRoutes = /^\/(login|signup|otp-verification)/.test(location.pathname);
  console.log(isAuthRoutes)
  return (
    <>
      {!isAuthRoutes && <UserNavBar />}
      {loading && < Loader />}
      <Routes>
        <Route path='/' element={
          <ProtectedRoutes >
            <UserHome />
          </ProtectedRoutes>
        } />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignUp />} />
        <Route path='/otp-verification' element={<UserOTPVerification />} />
      </Routes>
      {!isAuthRoutes && <UserFooter />}
    </>
  )
}


export default UserRoutes

