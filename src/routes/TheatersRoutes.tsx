import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { TheaterForgotPassword, TheatersHome, TheatersLogin, TheatersSignUp } from '../pages/theaters'
import { TheaterOTPVerification } from "../pages/theaters/theaterOTPVerifiy";
import { useLoggedOwner } from "../hooks/useLoggedUser";
import { Loader } from "../component/Loader";
import { TheaterProtectedRoutes } from "../component/theaters/theaterProtectedRoutes";
import { ErroPage } from "../pages/ErrorPage";
import { Role } from "../interface/Interface";


const TheatersRoutes: React.FC = () => {
  const { loading } = useLoggedOwner(Role.theaters);


  return (
    <>
      <Suspense fallback={<Loader />} >

        <Routes>
          <Route path="*" element={<ErroPage redirectPath="/theaters/home" />} />
          <Route path='/home' element={
            <TheaterProtectedRoutes>
              <TheatersHome />
            </TheaterProtectedRoutes>

          } />
          <Route path='/login' element={<TheatersLogin />} />
          <Route path='/signup' element={<TheatersSignUp />} />
          <Route path='/forgot-password' element={<TheaterForgotPassword />} />
          <Route path='/otp-verification' element={<TheaterOTPVerification />} />
        </Routes>

      </Suspense>
    </>
  )
}


export default TheatersRoutes


