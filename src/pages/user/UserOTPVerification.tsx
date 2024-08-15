import React, { useEffect, useState } from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import { useForm } from "../../hooks/UseForm";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch, } from "react-redux";
import { AppDispatch, } from "../../redux/store";
import { verifyUser } from "../../redux/actions/userAction";
import { ResponseData, ResponseStatus, Role } from "../../interface/Interface";
import { useNavigate } from "react-router-dom";
import { clearUserError } from "../../redux/reducers/userReducer";
import { useLoggedOwner } from "../../hooks/useLoggedUser";
import { formatTime } from "../../utils/format";
import { isErrorResponse } from "../../utils/customError";
import Toast from "../../component/Toast";
import { useTimer } from "../../hooks/useTimer";
import ResendOTP from "../../component/ResendOTP";
import useAction from "../../hooks/UseAction";




const UserOTPVerification: React.FC = (): JSX.Element => {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  const { error, tempMail } = useLoggedOwner(Role.users);

  const { clearTempMail, clearError } = useAction(Role.users)

  useEffect(() => {

    if (!tempMail) {
      navigate('/login')
    }

    clearError()
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {

      event.preventDefault();
      clearTempMail ?
        clearTempMail()
        : null

    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)

  }, [])

  const { formData, inputError, handleChange, setInputError } = useForm({
    otp: ''
  }, Role.users);

  const [response, setResponse] = useState<ResponseData | null>(null);
  const { timeRemaining, isActive, resetTimer } = useTimer(120);



  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (event: React.FormEvent) => {
    try {
      const isValid = handleSubmit(event);
      if (isValid) {
        if (tempMail) {
          const result = await dispatch(verifyUser({ ...formData, email: tempMail.email })).unwrap();
          if (result.status === ResponseStatus.SUCCESS) {
            navigate(result.redirectURL, { replace: true, state: { verified: true } })
          }

        } else {
          navigate('/login', { replace: true })
        }
      }
    } catch (err) {
      if (isErrorResponse(error)) {
        setResponse({ message: error.message, status: error.status, redirectURL: error?.redirectURL })
      }
    } finally {
      setResponse(null)
    }

  };
  const backgroundImagePath = { backgroundImage: `url(${backgroundImage})` };

  return (
    <>


      <section className="background h-full  md:h-screen overlay flex items-center justify-center " style={backgroundImagePath}>
        {response && <Toast status={response?.status} message={response?.message} role={Role.users} />}
        <div className="flex rounded-2xl p-5 justify-center">

          <div className={`relative px-8 md:px-24 py-24 space-y-8 bg-black bg-opacity-50`}>


            <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-green-600 text-sm  font-extrabold text-center  ">

              OTP has been send to your email account ! Please verify

            </h1>
            {/* form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-8 ">


              <div className="p-2 mt-1  text-white rounded-md w-full relative ">
                <label htmlFor="otp">Enter Your OTP</label>
                <input
                  className="p-2 mt-3  text-black rounded-md w-full focus:outline"
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
                {inputError.otp && <small className='text-red-600 capitalize absolute -bottom-4 left-3'>{inputError.otp}</small>}
                {error?.error === 'otp' && <small className='text-red-600 capitalize absolute -bottom-4 left-3'>{error.message}</small>}
              </div>
              <div className="flex justify-end mb-2">

                <ResendOTP isActive={isActive} resetTimer={resetTimer} role={Role.users} setResponse={setResponse} />

              </div>
              <button className="bg-black rounded-md  text-white py-2  "  >
                Verify OTP
              </button>
              <div className="mt-2 text-white text-sm text-center">
                Time remaining: {formatTime(timeRemaining)}
              </div>


            </form>
          </div>
        </div>
      </section >

    </>
  )
}

export default UserOTPVerification