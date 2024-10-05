import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLogin, AdminParent } from '../pages/admin'
import { AdminProtectedRoutes } from "../component/admin/adminProtectedRoutes";
import { ErroPage } from "../pages/ErrorPage";
const AdminTheaters = lazy(() => import('../pages/admin/layout/AdminTheaters'))
import AdminHome from "../pages/admin/layout/AdminHome";
import { Loader } from "../component/Loader";
import AdminMovie from "../pages/admin/layout/AdminMovies";
import AdminStream from "../pages/admin/layout/AdminStream";

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

