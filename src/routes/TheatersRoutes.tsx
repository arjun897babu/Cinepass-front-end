import React, { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { TheaterForgotPassword, TheatersLogin, TheatersParent, TheatersSignUp } from '../pages/theaters'
import { TheaterOTPVerification } from "../pages/theaters/theaterOTPVerifiy";
import { useLoggedOwner } from "../hooks/useLoggedUser";
import { Loader } from "../component/Loader";
import { TheaterProtectedRoutes } from "../component/theaters/theaterProtectedRoutes";
import { ErroPage } from "../pages/ErrorPage";
import { Role } from "../interface/Interface";
import { TheaterResetPassWord } from "../pages/theaters/TheaterResetPassword";
const TheaterDetail = lazy(() => import('../pages/theaters/Layout/TheaterDetail'))
const TheaterHome = lazy(() => import('../pages/theaters/Layout/TheaterHome'))

const TheatersRoutes: React.FC = () => {
  const { loading } = useLoggedOwner(Role.theaters);


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

          }>
            <Route path="home" element={<TheaterHome />} />
            <Route path="theater" element={<TheaterDetail />} />
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


