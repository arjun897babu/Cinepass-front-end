import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLogin,AdminHome } from '../pages/admin'


const UserRoutes: React.FC = () => {
  return (
    <>

      <Routes>
        <Route path='/home' element={<AdminHome />} />
        <Route path='/login' element={<AdminLogin />} />
      </Routes>

    </>
  )
}


export default UserRoutes

