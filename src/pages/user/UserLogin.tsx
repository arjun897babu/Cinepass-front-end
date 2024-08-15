
import React, { FormEvent, useEffect, useState } from 'react';
import '../../index.css';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import backGroundImage from '/Iconic Movie Posters Collage.webp';
import { useForm } from '../../hooks/UseForm';
import { useFormSubmit } from '../../hooks/UseFormSubmitt';
import { useDispatch, } from 'react-redux';
import { AppDispatch, } from '../../redux/store';
import { loginUser } from '../../redux/actions/userAction';
import { ResponseStatus, Role } from '../../interface/Interface';
import { isErrorResponse } from '../../utils/customError';
import { useLoggedOwner } from '../../hooks/useLoggedUser';
import useAction from '../../hooks/UseAction';

import GoogleSignUp from '../../component/user/GoogleSignUp';

import { PasswordInput } from '../../component/PasswordInput';
import Toast2 from '../../component/Toast2';



export const UserLogin: React.FC = (): JSX.Element => {
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useLoggedOwner(Role.users);
  const { clearError } = useAction(Role.users)  

  const {
    formData,
    inputError,
    handleChange,
    setInputError
  } = useForm({ email: '', password: '' }, Role.users);

  useEffect(() => { 

    if (isAuthenticated) {
      navigate('/')
    }
    clearError
  }, [isAuthenticated])

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (event: FormEvent) => {

    const isValid = handleSubmit(event);

    if (isValid) {
      try {
        const result = await dispatch(loginUser(formData)).unwrap();
        if (result.status === ResponseStatus.SUCCESS) {
          navigate(result.redirectURL)
        }
      } catch (err) {
        if (isErrorResponse(err)) {
          navigate(err.redirectURL);
        }
      }
    }
  }



  let background_image_path = { backgroundImage: `url(${backGroundImage})` };

  return (

    <section className="background overlay flex items-center justify-center " style={background_image_path}>

      {
        error?.error === 'googleAuth'
        ||
        error?.error === 'blocked' &&
        <Toast2
          message={error.message}
          clearToast={clearError}
          alert={ResponseStatus.ERROR}
        />
      } 
      
      <div className="flex p-5 justify-center">

        <div className={`relative md:w-3/5 px-4 sm:px-24 py-24 space-y-8  `}>

          &&
          <Link to={'/'} >
            <div className="justify-center items-center flex px-6 py-3 text-nowrap rounded-md mt-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 cursor-pointer  bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-base  font-black absolute top-0 left-24">
              < FaArrowLeft className='text-zinc-600 mr-2' /> Back to home
            </div>
          </Link>



          <h1 className=" bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-3xl  font-black text-center  ">

            Unlock the Magic of Cinema with CinePass


          </h1>
          {/* form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-1 ">

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label htmlFor="email">Email</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {inputError.email && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{inputError?.email}</small>}
              {error?.error === 'email' && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{error.message}</small>}
            </div>

            <PasswordInput
              name='password'
              label='password'
              onChange={handleChange}
              placeholder='enter your password'
              value={formData.password}
              inputError={inputError.password ? inputError.password : undefined}
              responseError={error?.error === 'password' ? error.message : undefined}
            />

            <div className="flex justify-end mb-9">
              <Link to={'/forgot-password'} >
                <span className="font-extrabold  mt-5 text-xs text-white">
                  Forgot password?
                </span>
              </Link>
            </div>


            <button className="bg-black rounded-md text-white py-2  ">
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
              <div className="mt-3 text-xs flex justify-end font-extrabold   text-white">
                Don't have an account?
              </div>
            </Link>

            <div className='w-full flex items-center justify-center'>
              <GoogleSignUp />
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


{/* <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label htmlFor="Password">Password</label>
              <input
                className="p-2 mt-3  text-black rounded-md w-full focus:outline"
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
              />

              {inputError.password && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{inputError.password}</small>}
              {error?.error === 'password' && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{error.message}</small>}
            </div> */}