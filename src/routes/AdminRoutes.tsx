import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErroPage } from "../pages/ErrorPage";
import { Loader } from "../component/Loader";

import { AdminProtectedRoutes } from "../component/admin/adminProtectedRoutes";
import { AdminLogin, AdminParent } from '../pages/admin'

const AdminStream = lazy(() => import("../pages/admin/layout/AdminStream"))
const AdminMovie = lazy(() => import("../pages/admin/layout/AdminMovies"))
const AdminTheaters = lazy(() => import('../pages/admin/layout/AdminTheaters'))
const AdminHome = lazy(() => import("../pages/admin/layout/AdminHome"))
const AdminStreamPlan = lazy(() => import("../pages/admin/layout/AdminStreamPlan"))
const AdminUsers = lazy(() => import('../pages/admin/layout/AdminUsers'))


const AdminRoutes: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>

        <Routes>
          <Route path="/" element={<Navigate to="/admin/home" />} />

          <Route path="*" element={<ErroPage redirectPath="/admin/home" />} />
          <Route path='/login' element={<AdminLogin />} />
          <Route
            path='/'
            element={
              <AdminProtectedRoutes>
                <AdminParent />
              </AdminProtectedRoutes>
            }
          >
            <Route path="home" element={<AdminHome />} />
            <Route path="theaters" element={<AdminTheaters />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="movie" element={<AdminMovie />} />
            <Route path="stream" element={<AdminStream />} />
            <Route path="stream-plan" element={<AdminStreamPlan />} />
          </Route>


        </Routes>

      </Suspense>
    </>
  )
}


export default AdminRoutes

