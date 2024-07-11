import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLogin,AdminHome } from '../pages/admin'


const UserRoutes: React.FC = () => {
  return (
    <>

      <Routes>
        <Route path='/login' element={<AdminLogin />} />
        <Route path='/' element={<AdminHome />} />
      </Routes>

    </>
  )
}


export default UserRoutes

