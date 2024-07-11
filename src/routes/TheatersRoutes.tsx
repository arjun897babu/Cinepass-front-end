import React from "react";
import { Route, Routes } from "react-router-dom";
import { TheatersHome, TheatersLogin, TheatersSignUp } from '../pages/theaters'


const UserRoutes: React.FC = () => {
  return (
    <>

      <Routes>
        <Route path='/' element={<TheatersHome />} />
        <Route path='/login' element={<TheatersLogin />} />
        <Route path='/signUp' element={<TheatersSignUp />} />
      </Routes>

    </>
  )
}


export default UserRoutes

