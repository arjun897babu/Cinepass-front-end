import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLogin, AdminHome } from '../pages/admin'
import { AdminProtectedRoutes } from "../component/admin/adminProtectedRoutes";


const UserRoutes: React.FC = () => {
  return (
    <>

      <Routes>
        <Route path='/home' element={
          <AdminProtectedRoutes>
            <AdminHome />
          </AdminProtectedRoutes>

        } />
        <Route path='/login' element={<AdminLogin />} />
      </Routes>

    </>
  )
}


export default UserRoutes

