
import React, { FormEvent, useEffect, useState } from 'react';
import '../../index.css';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import backGroundImage from '/movie_projector.jpg'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
 
import { useForm } from '../../hooks/UseForm';
import { useFormSubmit } from '../../hooks/UseFormSubmitt';
import { loginTheaters } from '../../redux/actions/theaterAction';
import { ResponseStatus, Role } from '../../interface/Interface';
import { isResponseError } from '../../utils/customError';
import { theaterClearError } from '../../redux/reducers/theatersReducer';
import { PasswordInput } from '../../component/PasswordInput';
import Toast2, { Toast } from '../../component/Toast2';



export const TheatersLogin: React.FC = (): JSX.Element => {
  const location = useLocation()

  const dispatch = useDispatch<AppDispatch>();
  const { error, isAuthenticated } = useSelector((state: RootState) => state.theaters)

  const navigate = useNavigate();


  const [toastMessage, setToastMessage] = useState<Toast | null>(null)


  useEffect(() => {
    dispatch(theaterClearError());

    if (isAuthenticated) {

      navigate('/theaters/home', { replace: true });
      return;
    }

    const state = location.state;

    if (state?.blocked) {
      setToastMessage({
        alert: ResponseStatus.ERROR,
        message: 'Account Blocked',
      });
    } else if (state?.verified) {
      setToastMessage({
        alert: ResponseStatus.SUCCESS,
        message: 'Account verified successfully',
      });
    } else if (state?.password) {
      setToastMessage({
        alert: ResponseStatus.SUCCESS,
        message: 'Password updated successfully',
      });
    } else if (state?.serverError) {
      setToastMessage({
        alert: ResponseStatus.ERROR,
        message: 'Something went wrong',
      });
    }


    navigate(location.pathname, { replace: true });

  }, [isAuthenticated, location.state]);


  const { formData, handleChange, inputError, setInputError } = useForm({
    email: '',
    password: ''
  }, Role.theaters)
  const { handleSubmit } = useFormSubmit(formData, setInputError)
  let background_image_path = { backgroundImage: `url(${backGroundImage})` };
  const onSubmit = async (e: FormEvent) => {

    try {
      const isValid = handleSubmit(e)
      if (isValid) {
        const response = await dispatch(loginTheaters(formData)).unwrap();

        if (response.status === ResponseStatus.SUCCESS) {
          navigate(response.redirectURL, { replace: true })
        }
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
        } else if (err.statusCode === 401 && err.data.error == 'otp') {
          navigate('/otp-verification')
        } else if (err.statusCode === 400 || err.statusCode === 404 || err.statusCode === 401) {
          setInputError(
            {
              [err.data.error]: err.data.message
            }
          )
        } else {
          setToastMessage({
            alert: ResponseStatus.ERROR,
            message: err.data.message
          })
        }
      }
    }

  }


  return (
    <>

      {
        toastMessage &&
        <Toast2
          alert={toastMessage.alert}
          message={toastMessage.message}
          clearToast={() => setToastMessage(null)}
        />
      }

      <section className="background overlay flex items-center justify-center " style={background_image_path}>



        <div className="flex p-5 justify-center">

          <div className={`relative sm:w-3/5 px-8   py-24 space-y-8 bg-white bg-opacity-10`}>


            <h1 className=" mt-2  bg-clip-text text-transparent bg-white text-3xl  font-black text-center  ">

              Empower Your Movie Management with CinePass

            </h1>
            {/* form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-1 ">

              <div className="p-2 mt-1 text-white gap-3 w-full relative flex justify-center items-center text-center">
                <label className='w-24 text-left' htmlFor="email">Email</label>
                <div className="relative w-full">
                  <input
                    className="p-2  text-black rounded-md w-full focus:outline-none"
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                  {inputError.email && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.email}</small>}
                  {error?.error === 'email' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                </div>
              </div>

              <PasswordInput
                label='password'
                name='password'
                onChange={handleChange}
                placeholder='enter your password'
                value={formData.password}
                inputError={inputError.password ? inputError.password : undefined}
                responseError={error?.error === 'password' ? error.message : undefined}
                theater={true}
              />
              <div className="flex justify-end">
                <Link to={`/theaters/forgot-password`}>
                  <button className="m-5 text-xs text-white" >
                    Forgot password?
                  </button>
                </Link>
              </div>


              <button className="bg-white  rounded-md text-black py-2  ">
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

              <div className="mt-3 text-xs flex justify-end items-center text-white  ">
                <span className='  px-5 py-2 rounded-md'>Don't have an account?</span>
                <Link to={`/theaters/signup`}>
                  <button className="py-2 px-5 bg-white text-black rounded-md">
                    Register
                  </button>
                </Link>
              </div>


            </>


          </div>


        </div>
      </section >
    </>
  )
}