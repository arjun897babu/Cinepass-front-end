import React, { FormEvent, memo, useEffect, useState } from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import backgroundImage1 from '/movie_projector.jpg'
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/UseForm";
import { useLoggedOwner } from "../hooks/useLoggedUser";
import { ResponseData, ResponseStatus, Role } from "../interface/Interface";
import { useFormSubmit } from "../hooks/UseFormSubmitt";
import { forgotPasswordUser } from "../redux/actions/userAction";
import { forgotPasswordTheaters } from "../redux/actions/theaterAction";
import Toast from "./Toast";
import UseAction from "../hooks/UseAction";
import { isErrorResponse } from "../utils/customError";
import Toast2 from "./Toast2";


const ForgotPassword: React.FC<{ role: Role }> = ({ role }): JSX.Element => {
  console.log(role)
  const { error,isAuthenticated } = useLoggedOwner(role)
  const backgroundImagePath = { backgroundImage: `url(${role === Role.users ? backgroundImage : backgroundImage1})` };
  const dispatch = useDispatch<AppDispatch>();
  const { setError, clearError } = UseAction(role)

  useEffect(() => {

    if (isAuthenticated) {
      navigate('/theaters/home', { replace: true })
      return
    }

  }, [isAuthenticated])

  const navigate = useNavigate();
  const [response, setResponse] = useState<ResponseData | null>(null)
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
          setTimeout(() => {
            setResponse(null)
          }, 2000)
          setResponse({ message: response.message, status: response.status, redirectURL: response.redirectURL })
        }
      }
    } catch (error) {
      if (isErrorResponse(error)) {

        if (error.error?.error) {
          navigate(role === Role.users ?
            '/login'
            : `${role}/login` ,{replace:true,state:{google:true}})
        }
      }
    }

  }
  return (

    <>
      {response && <Toast message={response.message} status={response.status} role={role} />}
      {
        error?.error === 'approval'
        ||
        error?.error === 'blocked' &&
        <Toast2
          alert={ResponseStatus.ERROR}
          message={error.message}
          clearToast={clearError}
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
                {!error?.error && inputError.email && <small className='text-red-600 capitalize absolute -bottom-4 left-3 font-mono'>{inputError.email}</small>}
                {error?.error === 'email' && <small className='text-red-600 capitalize absolute -bottom-4 left-3 font-mono'>{error.message}</small>}
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
