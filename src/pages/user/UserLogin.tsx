
import React, { FormEvent, useEffect, useState } from 'react';
import '../../index.css';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import backGroundImage from '/Iconic Movie Posters Collage.webp';
import { useForm } from '../../hooks/UseForm';
import { useFormSubmit } from '../../hooks/UseFormSubmitt';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { loginUser } from '../../redux/actions/userAction';
import { ResponseStatus } from '../../interface/Interface';
import { isErrorResponse } from '../../utils/customError';
import { clearError } from '../../redux/reducers/userReducer';
import { useLoggedOwner } from '../../hooks/useLoggedUser';
import { CredentialResponse, GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';



export const UserLogin: React.FC = (): JSX.Element => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { error, isAuthenticated } = useLoggedOwner('user');

  const { formData, inputError, handleChange, setInputError } = useForm({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
    dispatch(clearError())
  }, [isAuthenticated])

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (event: FormEvent) => {

    const isValid = handleSubmit(event);

    if (isValid) {

      try {
        const result = await dispatch(loginUser(formData)).unwrap();

        if (result.status === ResponseStatus.SUCCESS) {
          navigate('/')
        }

      } catch (err) {
        console.log(error)
        if (isErrorResponse(err)) {
          console.log(err)
          navigate(err.redirectURL);
        }
      }


    }
  }



  let background_image_path = { backgroundImage: `url(${backGroundImage})` };

  return (

    <section className="background overlay flex items-center justify-center " style={background_image_path}>

      <div className="flex rounded-2xl p-5 justify-center">

        <div className={`relative md:w-3/5 px-8 md:px-24 py-24 space-y-8  `}>

          &&
          <Link to={'/'} >
            <div className="justify-center items-center flex px-6 py-3 text-nowrap rounded-md mt-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 cursor-pointer  bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-base  font-black absolute top-0 left-24">
              < FaArrowLeft className='text-zinc-600 mr-2' /> Back to home
            </div>
          </Link>



          <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-3xl  font-black text-center  ">

            Unlock the Magic of Cinema with CinePass


          </h1>
          {/* form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-1 ">

            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="email">Email</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {inputError.email && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{inputError?.password}</small>}
              {error?.error === 'email' && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{error.message}</small>}
            </div>
            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="Password">Password</label>
              <input
                className="p-2 mt-3  text-black rounded-xl w-full focus:outline"
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
              />

              {inputError.password && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{inputError.password}</small>}
              {error?.error === 'password' && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{error.message}</small>}
            </div>


            <div className="flex justify-end">
              <button className="  mt-5 text-xs text-white">
                Forgot password?
              </button>
            </div>


            <button className="bg-black rounded-xl text-white py-2  ">
              Login
            </button>
          </form>

          {/* form */}


          <>
            {/* ------------------------------------------ */}
            < div className="mt-6 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400" />
              <p className="text-center text-sm">OR</p>
              <hr className="border-gray-400" />
            </div>
            {/* ------------------------------------------ */}

            <Link to={`/signup`}>
              <div className="mt-3 text-xs flex justify-end   text-black">
                <span className='bg-white px-5 py-2 rounded-xl'>Don't have an account?</span>
                <button className="py-2 px-5 bg-black  text-white rounded-xl  ">
                  Register
                </button>
              </div>
            </Link>

            <div className='w-full flex items-center justify-center'>
              {/* <GoogleLogin width={100} onSuccess={responseMessage} onError={errorMessage} /> */ }
            </div>



          </>


        </div>
        {/* image */}
        <div className="md:block hidden w-1/2">
          <img
            className="right-section rounded-2xl h-screen object-cover "
            src={backGroundImage}
          />
        </div>
      </div>
    </section >
  )
}
