import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { UserSignUp } from "../pages/user/UserSignUp";
import { Loader } from "../component/Loader";
import { ErroPage } from "../pages/ErrorPage";
import { UserLogin } from "../pages/user/UserLogin";
import { UserForgotPassword } from "../pages/user/UserForgotPassword";
import { ResetPassWordUser } from "../pages/user/ResetPassWordUser";
import UserOTPVerification from "../pages/user/UserOTPVerification";
import UserNavBar from "../component/user/UserNavBar";
import UserFooter from "../component/user/footer/UserFooter";
const UserInitPage = lazy(() => import("../pages/user/UserInitPage"));

import { ProtectedRoutes } from "../component/user/ProtectedRoutes";
import { UserProfile } from "../pages/user/userProfile";

const UserInfo = lazy(() => import("../pages/user/layout/UserInfo"));
const TheaterDetails = lazy(() => import("../pages/user/TheaterDetails"));
const ScreenLayout = lazy(() => import("../pages/user/ScreenLayout"));
const PaymentSuccess = lazy(() => import("../pages/user/PaymentSuccess"));
const PaymentSummary = lazy(() => import("../pages/user/PaymentSummary"));
const TicketSummary = lazy(() => import("../pages/user/layout/TicketSummary"));
const MoviePage = lazy(() => import("../pages/user/MoviePage"));
const UserHome = lazy(() => import('../pages/user/UserHome'))
const StreamHomePage = lazy(() => import('../pages/user/StreamHomePage'))

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
              <Route path='booking' element={<TicketSummary />} />

            </Route>
            <Route path='/movie/:movieId' element={<MoviePage />} />
            <Route path='/theater/:theaterId' element={<TheaterDetails />} />
            <Route path='/movie/layout/:showId' element={<ScreenLayout />} />
            <Route path='/streams' element={<StreamHomePage />} />
            <Route path='/paymentsuccess' element={
              <ProtectedRoutes>
                <PaymentSuccess />
              </ProtectedRoutes>
            }
            ></Route>
            <Route path='/payment' element={
              <PaymentSummary />
            }
            ></Route>
          </Routes>
        </main>
        {!isAuthRoutes && <UserFooter />}
      </Suspense>
    </div>
  );
}

export default UserRoutes;
