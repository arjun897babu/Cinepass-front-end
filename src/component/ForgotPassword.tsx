import React, { FormEvent, memo, useEffect, useState } from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import backgroundImage1 from '/movie_projector.jpg'
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/UseForm";
import { ResponseStatus, Role } from "../interface/Interface";
import { useFormSubmit } from "../hooks/UseFormSubmitt";
import { forgotPasswordUser } from "../redux/actions/userAction";
import { forgotPasswordTheaters } from "../redux/actions/theaterAction";
import { isResponseError } from "../utils/customError";
import Toast2, { Toast } from "./Toast2";


const ForgotPassword: React.FC<{ role: Role }> = ({ role }): JSX.Element => {

  const { isAuthenticated } = useSelector((state: RootState) => {
    switch (role) {
      case Role.users:
        return state.user;
      case Role.theaters:
        return state.theaters;
      case Role.admin:
        return state.admin;

      default:
        return { isAuthenticated: false };
    }
  });
  const backgroundImagePath = { backgroundImage: `url(${role === Role.users ? backgroundImage : backgroundImage1})` };
  const dispatch = useDispatch<AppDispatch>();



  useEffect(() => {
    //forgot password page is not acccessible for logged user
    if (isAuthenticated) {
      navigate('/theaters/home', { replace: true }) // redirect to home page
      return
    }

  }, [isAuthenticated])

  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<Toast | null>(null)
  const clearToast = () => setToastMessage(null)
  const { formData, handleChange, inputError, setInputError } = useForm({
    email: '',
  }, role)
  const { handleSubmit } = useFormSubmit(formData, setInputError);
  const onSubmit = async (e: FormEvent) => {

    const isValid = handleSubmit(e)
    try {
      if (isValid) {
        let response
        if (role === Role.users) {
          response = await dispatch(forgotPasswordUser(formData)).unwrap()
        }
        else if (role === Role.theaters) {
          response = await dispatch(forgotPasswordTheaters(formData)).unwrap()
        }
        if (response?.status === ResponseStatus.SUCCESS) {
          setToastMessage({
            alert: response.status,
            message: response.message
          })
        }
      }
    } catch (error) {

      if (isResponseError(error)) {
        if (error.statusCode === 400 || error.statusCode === 403) {

          navigate(role === Role.users ?
            '/login'
            : `/${role}/login`, { replace: true, state: { [error.data.error]: true } })
        }
        else if (error.statusCode === 404) {
          setInputError({
            [error.data.error]: error.data.message,
          })
        } else {
          setToastMessage({
            alert: ResponseStatus.ERROR,
            message: error.data.message
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
          clearToast={clearToast}
          modalToast={true}
        />}

      <section className="background  md:h-screen overlay flex items-center justify-center " style={backgroundImagePath}>
        <div className="flex rounded-2xl p-5 justify-center">

          <div className={`relative px-8 md:px-24 py-24 space-y-8 bg-black bg-opacity-50`}>


            <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-green-600 text-sm  font-extrabold text-center  ">

              Enter Your Email Address !

            </h1>
            {/* form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-1 ">


              <div className="p-2 mt-1  text-white rounded-md w-full relative ">
                <label htmlFor="email">  Email Address</label>
                <input
                  className="p-2 mt-3  text-black rounded-md w-full focus:outline"
                  type="text"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {inputError.email && <small className='text-red-600 capitalize absolute -bottom-4 left-3 font-mono'>{inputError.email}</small>}
              </div>
              <button className="bg-black font-bold uppercase rounded-md mt-6 border-2 border-white text-white py-2  ">
                Submit
              </button>

            </form>
          </div>
        </div>
      </section >
    </>
  )
}

export default memo(ForgotPassword);
