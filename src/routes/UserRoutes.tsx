import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
// import { UserHome, UserSignUp, UserLogin, UserOTPVerification } from '../pages/user'
// import UserHome from "../pages/user/UserHome";
const UserHome = lazy(() => import('../pages/user/UserHome'))
import { UserSignUp } from "../pages/user/UserSignUp";
import { UserLogin } from "../pages/user/UserLogin";
// import { UserOTPVerification } from "../pages/user/UserOTPVerification";
const UserOTPVerification = lazy(() => import('../pages/user/UserOTPVerification'))

import UserNavBar from "../component/user/UserNavBar";
import UserFooter from "../component/user/footer/UserFooter";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Loader } from "../component/Loader";
import { ProtectedRoutes } from "../component/user/ProtectedRoutes";
import { UserProfile } from "../pages/user/userProfile";
import { ErroPage } from "../pages/ErrorPage";
import { UserForgotPassword } from "../pages/user/UserForgotPassword";

const UserRoutes: React.FC = () => {
  const location = useLocation();
  const { loading } = useSelector((state: RootState) => state.user)
  const isAuthRoutes = /^\/(login|signup|forgot-password|otp-verification)/.test(location.pathname);

  return (
    <>
      <Suspense fallback={< Loader />}>

        {!isAuthRoutes && <UserNavBar />}
        <Routes>
          <Route path="*" element={<ErroPage />} />
          <Route path='/' element={
            <UserHome />
          } />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/signup' element={<UserSignUp />} />
          <Route path='/forgot-password' element={<UserForgotPassword />} />
          <Route path='/otp-verification' element={<UserOTPVerification />} />
          <Route path='/profile' element={
            <ProtectedRoutes>
              <UserProfile />
            </ProtectedRoutes>
          } />
        </Routes>
        {!isAuthRoutes && <UserFooter />}
      </Suspense>
    </>
  )
}


export default UserRoutes

