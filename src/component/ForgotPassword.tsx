import { FormEvent, useState } from "react"
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
interface ForgotPasswordProps {
  role: Role
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ role }): JSX.Element => {
  console.log(role)
  const { error } = useLoggedOwner(role)
  const backgroundImagePath = { backgroundImage: `url(${role === Role.users ? backgroundImage : backgroundImage1 })` };
  const dispatch = useDispatch<AppDispatch>();
  const { setError } = UseAction(role)
  console.log(error)
  console.log(setError)
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
        console.log(role === Role.users,role === Role.theaters)
        let response
        if (role === Role.users) {
          response = await dispatch(forgotPasswordUser(formData)).unwrap()
        }
        else if (role === Role.theaters) {
          console.log('ssneding request')
          response = await dispatch(forgotPasswordTheaters(formData)).unwrap()
          console.log(response)
        }
        if (response?.status === ResponseStatus.SUCCESS) {
          setResponse({ message: response.message, status: response.status, redirectURL: response.redirectURL })
        }
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.log(error)
        if (error.error?.error) {
          setError({ error: error.error?.error as string, message: error.message })
        }
      }
    }

  }
  return (

    <>
      <section className="background  md:h-screen overlay flex items-center justify-center " style={backgroundImagePath}>
        {response && <Toast message={response.message} status={response.status} role={role} />}
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