import { FormEvent, useEffect, useState } from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import backgroundImage1 from '/movie_projector.jpg'
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { useNavigate, useParams } from "react-router-dom";

import { useForm } from "../hooks/UseForm";
import { useLoggedOwner } from "../hooks/useLoggedUser";
import { ResponseData, ResponseStatus, Role } from "../interface/Interface";
import { useFormSubmit } from "../hooks/UseFormSubmitt";
import { isErrorResponse } from "../utils/customError";
import Toast from "./Toast";
import { resetPassword } from "../redux/actions/userAction";
import { resetPasswordTheaters } from "../redux/actions/theaterAction";
import Toast2 from "./Toast2";
import useAction from "../hooks/UseAction";
import { PasswordInput } from "./PasswordInput";

const ResetPassWord: React.FC<{ role: Role }> = ({ role }) => {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const backgroundImagePath = { backgroundImage: `url(${role === Role.users ? backgroundImage : backgroundImage1})` };
  const dispatch = useDispatch<AppDispatch>();
  const [response, setResponse] = useState<ResponseData | null>()
  const { error } = useLoggedOwner(role);
  const { formData, handleChange, inputError, setInputError } = useForm({ password: '', confirm_password: '' }, role)
  const { clearError } = useAction(role)
  const { handleSubmit } = useFormSubmit(formData, setInputError)
  const { isAuthenticated } = useLoggedOwner(role)

  useEffect(() => {

    if (isAuthenticated) {
      navigate('/theaters/home', { replace: true })
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
          console.log(result)
        }
        if (result?.status === ResponseStatus.SUCCESS) {

          navigate(result.redirectURL,
            {
              replace: true,
              state: { password: true }
            })

        }
      } else {
        if (isValid) {
          navigate(`${Role.users === role ?
            '/login'
            : `/${role}/login`}`,
            {
              replace: true,
              state: { serverError: true }
            })
        }
      }
    } catch (error) {
      console.log(error)
      if (isErrorResponse(error)) {
        console.log(error)
        if (error.error?.error !== 'password') {
          navigate(`${Role.users === role ?
            '/login'
            : `/${role}/login`}`,
            {
              replace: true,
              state: { serverError: true }
            })
        }
      }
    }
  }

  return (
    <>

      {
        error?.error === 'approval'
        ||
        error?.error === 'blocked' &&
        <Toast2
          alert={ResponseStatus.ERROR}
          message={error.message}
          clearToast={clearError}
        />
      }

      <section className="background  md:h-screen overlay flex items-center justify-center " style={backgroundImagePath}>
        {response && <Toast message={response.message} status={response.status} role={role} />}
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
{/* <div className="p-2 mt-1  text-white rounded-md w-full relative ">
                  <label htmlFor="confirm_password">  New Password</label>
                  <input
                    className="p-2 mt-3  text-black rounded-md w-full focus:outline"
                    type="text"
                    name="confirm_password"
                    placeholder="confirm password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                  {!error?.error && inputError.confirm_password && <small className='text-red-600 capitalize absolute -bottom-4 left-3 font-mono'>{inputError.confirm_password}</small>}
  
                </div> */}