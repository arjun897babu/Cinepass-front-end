import { FormEvent, useEffect, useState } from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import backgroundImage1 from '/movie_projector.jpg'
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { useNavigate, useParams } from "react-router-dom";

import { useForm } from "../hooks/UseForm";
 import {  ResponseStatus, Role } from "../interface/Interface";
import { useFormSubmit } from "../hooks/UseFormSubmitt";

import { resetPassword } from "../redux/actions/userAction";
import { resetPasswordTheaters } from "../redux/actions/theaterAction";
import Toast2, { Toast } from "./Toast2";
// import { userClearError } from '../redux/reducers/userReducer'
// import { theaterClearError } from '../redux/reducers/theatersReducer'
import { PasswordInput } from "./PasswordInput";
import { isResponseError } from "../utils/customError";

const ResetPassWord: React.FC<{ role: Role }> = ({ role }) => {
  const navigate = useNavigate()
  const [toastMessage, setToastMessage] = useState<Toast | null>(null)
  const { token } = useParams<{ token: string }>()
  const backgroundImagePath = { backgroundImage: `url(${role === Role.users ? backgroundImage : backgroundImage1})` };
  const dispatch = useDispatch<AppDispatch>();

  const { error, isAuthenticated } = useSelector((state: RootState) => {
    switch (role) {
      case Role.users:
        return state.user;
      case Role.theaters:
        return state.theaters;
      case Role.admin:
        return state.admin;

      default:
        return { error: null, isAuthenticated: false };
    }
  });
  const { formData, handleChange, inputError, setInputError } = useForm({ password: '', confirm_password: '' }, role)
  // const clearErrorAction = (Role.theaters === role) ? theaterClearError : userClearError;

  // const dipatchClearError = () => {
  //   dispatch(clearErrorAction());
  // }

  const clearToast = () => setToastMessage(null)
  const { handleSubmit } = useFormSubmit(formData, setInputError)


  useEffect(() => {
    //not accessible for logged user or logged theaeter owner
    if (isAuthenticated) {
      navigate(role === Role.theaters ? '/theaters/home' : '/', { replace: true }) //based on the role page will navigate to the home
      return
    }

  }, [isAuthenticated])

  const onSubmit = async (e: FormEvent) => {
    const isValid = handleSubmit(e);
    try {
      if (isValid && token) {
        let result
        if (role == Role.users) {
          result = await dispatch(resetPassword({ password: formData.password, token })).unwrap()
        } else {
          result = await dispatch(resetPasswordTheaters({ password: formData.password, token })).unwrap()

        }
        if (result?.status === ResponseStatus.SUCCESS && result?.redirectURL) {

          navigate(result?.redirectURL,
            {
              replace: true,
              state: { password: true }
            })

        }
      }
    } catch (error) {
      
      if (isResponseError(error)) {
      
        if (error.statusCode === 403) {
          navigate(role === Role.theaters ? '/theaters/login' : '/login',
            {
              replace: true,
              state: { blocked: true }
            })

        } else if (error.statusCode === 400) {
          setInputError({
            [error.data.error]: error.data.message
          })
        } else {

          setTimeout(() => {
            navigate(role === Role.theaters ? '/theaters/login' : '/login',
              {
                replace: true,
              })
          }, 1000);

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
        />
      }

      <section className="background  md:h-screen overlay flex items-center justify-center " style={backgroundImagePath}>

        <div className="flex rounded-2xl p-5 justify-center w-full">

          <div className={`relative px-8 md:px-24 py-24 space-y-8 bg-black bg-opacity-50  w-1/2`}>


            <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-green-600 text-sm  font-extrabold text-center ">

              Enter a new Password

            </h1>
            {/* form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-1  ">

              <PasswordInput
                label="password"
                name="password"
                placeholder="enter new password"
                onChange={handleChange}
                value={formData.password}
                inputError={inputError.password ? inputError.password : undefined}
                responseError={error?.error === 'password' ? error.message : undefined}
                theater={true}
              />
              <PasswordInput
                label="confirm password"
                name="confirm_password"
                placeholder="re enter password"
                onChange={handleChange}
                value={formData.confirm_password}
                inputError={inputError.confirm_password ? inputError.confirm_password : undefined}
                responseError={error?.error === 'confirm_password' ? error.message : undefined}
                theater={true}
              />
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

export default ResetPassWord
