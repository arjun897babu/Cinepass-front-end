
import React, { FormEvent, useEffect, useState } from 'react';
import '../../index.css';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import backGroundImage from '/Iconic Movie Posters Collage.webp';
import { useForm } from '../../hooks/UseForm';
import { useFormSubmit } from '../../hooks/UseFormSubmitt';
import { useDispatch, useSelector, } from 'react-redux';
import { AppDispatch, RootState, } from '../../redux/store';
import { loginUser } from '../../redux/actions/userAction';
import { ResponseStatus, Role } from '../../interface/Interface';
import { isResponseError } from '../../utils/customError';


import GoogleSignUp from '../../component/user/GoogleSignUp';

import { PasswordInput } from '../../component/PasswordInput';
import Toast2, { Toast } from '../../component/Toast2';
import { userClearError } from '../../redux/reducers/userReducer';



export const UserLogin: React.FC = (): JSX.Element => {

  const location = useLocation();


  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, isAuthenticated, city, bookingInfo } = useSelector((state: RootState) => state.user)
  const [toastMessage, setToastMessage] = useState<Toast | null>(null)
  const [loading, setLoading] = useState(false)

  const handleToastMessage = (toast: Toast) => setToastMessage(toast)

  const {
    formData,
    inputError,
    handleChange,
    setInputError
  } = useForm({ email: '', password: '' }, Role.users);


  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/home/${city}`, { replace: true });
      return;
    }

    const state = location.state;

    if (state?.blocked) {
      setToastMessage({
        alert: ResponseStatus.ERROR,
        message: 'Account Blocked'
      });
    } else if (state?.verified) {
      setToastMessage({
        alert: ResponseStatus.SUCCESS,
        message: 'Account verified successfully'
      });
    } else if (state?.password) {
      setToastMessage({
        alert: ResponseStatus.SUCCESS,
        message: 'Password updated successfully'
      });
    } else if (state?.serverError) {
      setToastMessage({
        alert: ResponseStatus.ERROR,
        message: 'Something went wrong'
      });
    } else if (state?.google) {
      setToastMessage({
        alert: ResponseStatus.ERROR,
        message: 'use google auth'
      });
    } else if (error) {
      setToastMessage({
        alert: ResponseStatus.ERROR,
        message: 'something went wrong'
      });
    }

    dispatch(userClearError());
    navigate(location.pathname, { replace: true });
  }, [isAuthenticated]);

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (event: FormEvent) => {

    const isValid = handleSubmit(event);

    if (isValid) {
      setLoading(true)
      try {

        const response = await dispatch(loginUser(formData)).unwrap();
        if (response.status === ResponseStatus.SUCCESS && bookingInfo) {
          navigate('/payment', { replace: true })
        }
      } catch (err) {
        if (isResponseError(err)) {
          if (err.statusCode === 403) {
            setToastMessage({
              alert: ResponseStatus.ERROR,
              message: err.data.message
            })
          } else if (err.statusCode === 500) {
            setToastMessage({
              alert: ResponseStatus.ERROR,
              message: err.data.message
            })
          } else if (err.statusCode === 400 || err.statusCode === 404) {
            setInputError(
              {
                [err.data.error]: err.data.message
              }
            )
          }
          else if (err.statusCode === 401 && err.data.error !== 'googleAuth') {
            navigate('/otp-verification')
          } else {
            setToastMessage({
              alert: ResponseStatus.ERROR,
              message: err.data.message
            })
          }
        }
      } finally {
        setLoading(false)
      }
    }
  }



  let background_image_path = { backgroundImage: `url(${backGroundImage})` };

  return (

    <section className="background overlay flex items-center justify-center " style={background_image_path}>

      {/* {
        error?.error == 'googleAuth'
        ||
        error?.error === 'blocked' &&
        <Toast2
          message={error.message}
          clearToast={dispatchClearError}
          alert={ResponseStatus.ERROR}
        />
      } */}

      {
        toastMessage &&
        <Toast2
          alert={toastMessage.alert}
          message={toastMessage.message}
          clearToast={() => setToastMessage(null)}
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


            <button className={`bg-black rounded-md text-white   p-2`} disabled={loading}>
              {!loading ? 'Loading' : <span className=" loading loading-xs m-0 p-0  "></span>}
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
              <GoogleSignUp
                handleToastMessage={handleToastMessage}
              />
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