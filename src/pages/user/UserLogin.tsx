import React from "react";
import { Login } from "../auth/Login";
import iconic_movie_poster from '/Iconic Movie Posters Collage.webp'


const UserLogin: React.FC = () => {
  return (
    <>
      <Login backGroundImage={iconic_movie_poster} />
    </>
  )
}

export default UserLogin