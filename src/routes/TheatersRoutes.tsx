import React, { lazy, Suspense, } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "../component/Loader";
import { ErroPage } from "../pages/ErrorPage";

import { TheaterOTPVerification } from "../pages/theaters/theaterOTPVerifiy";
import { TheaterForgotPassword, TheatersLogin, TheatersParent, TheatersSignUp } from '../pages/theaters'
import { TheaterProtectedRoutes } from "../component/theaters/theaterProtectedRoutes";
import { TheaterResetPassWord } from "../pages/theaters/TheaterResetPassword";

const Bookings = lazy(() => import("../pages/theaters/Layout/Bookings"));
const TheaterShow = lazy(() => import("../pages/theaters/Layout/TheaterShow"));
const TheaterScreen = lazy(() => import("../pages/theaters/Layout/TheaterScreen"));
const TheaterDetail = lazy(() => import('../pages/theaters/Layout/TheaterDetail'))
const TheaterHome = lazy(() => import('../pages/theaters/Layout/TheaterHome'))

const TheatersRoutes: React.FC = () => {



  return (
    <>
      <Suspense fallback={<Loader />} >

        <Routes>
          <Route path="/" element={<Navigate to="/theaters/home" />} />
          <Route path="*" element={<ErroPage redirectPath="/theaters/home" />} />
          <Route path='/' element={
            <TheaterProtectedRoutes>
              <TheatersParent />
            </TheaterProtectedRoutes>

          }
          >
            <Route path="home" element={<TheaterHome />} />
            <Route path="theater" element={<TheaterDetail />} />
            <Route path="screen" element={<TheaterScreen />} />
            <Route path="shows" element={<TheaterShow />} />
            <Route path="bookings" element={<Bookings />} />

          </Route>
          <Route path='/login' element={<TheatersLogin />} />
          <Route path='/signup' element={<TheatersSignUp />} />
          <Route path='/forgot-password' element={<TheaterForgotPassword />} />
          <Route path='/reset-password/:token' element={<TheaterResetPassWord />} />
          <Route path='/otp-verification' element={<TheaterOTPVerification />} />
        </Routes>

      </Suspense>
    </>
  )
}


export default TheatersRoutes


