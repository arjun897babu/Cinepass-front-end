import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import UserHome from "../pages/user/UserHome";
import { UserSignUp } from "../pages/user/UserSignUp";
import { UserLogin } from "../pages/user/UserLogin";
const UserOTPVerification = lazy(() => import('../pages/user/UserOTPVerification'));
import UserNavBar from "../component/user/UserNavBar";
import UserFooter from "../component/user/footer/UserFooter"; 
import { Loader } from "../component/Loader";
import { ProtectedRoutes } from "../component/user/ProtectedRoutes";
import { UserProfile } from "../pages/user/userProfile";
import { ErroPage } from "../pages/ErrorPage";
import { UserForgotPassword } from "../pages/user/UserForgotPassword";
import { ResetPassWordUser } from "../pages/user/ResetPassWordUser";
import UserInitPage from "../pages/user/UserInitPage";
import UserInfo from "../pages/user/layout/UserInfo";
import TheaterDetails from "../pages/user/TheaterDetails";
import ScreenLayout from "../pages/user/ScreenLayout";
const MoviePage = lazy(() => import("../pages/user/MoviePage"));

const UserRoutes: React.FC = () => {
  const location = useLocation(); 
  const isAuthRoutes = /^\/(login|signup|forgot-password|movie\/layout|otp-verification|users\/reset-password)/.test(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-base-300">
      <Suspense fallback={<Loader />}>
        {!isAuthRoutes && <UserNavBar />}
        <main className="flex-1">
          <Routes>
            <Route path="*" element={<ErroPage />} />
            <Route path='/' element={<UserInitPage />} />
            <Route path='/home/:city' element={<UserHome />} />
            <Route path='/login' element={<UserLogin />} />
            <Route path='/signup' element={<UserSignUp />} />
            <Route path='/forgot-password' element={<UserForgotPassword />} />
            <Route path='/users/reset-password/:token' element={<ResetPassWordUser />} />
            <Route path='/otp-verification' element={<UserOTPVerification />} />
            <Route path='/profile' element={
              <ProtectedRoutes>
                <UserProfile />
              </ProtectedRoutes>
            }
            >
              <Route path='' element={<UserInfo />} />
              <Route path='booking' element={<MoviePage />} />
              <Route path='stream' element={<MoviePage />} />

            </Route>
            <Route path='/movie/:movieId' element={<MoviePage />} />
            <Route path='/theater/:theaterId' element={<TheaterDetails />} />
            <Route path='/movie/layout/:showId' element={<ScreenLayout />} />
          </Routes>
        </main>
        {!isAuthRoutes && <UserFooter />}
      </Suspense>
    </div>
  );
}

export default UserRoutes;
