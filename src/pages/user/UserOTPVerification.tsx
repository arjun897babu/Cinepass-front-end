import React, { useEffect, useState } from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import { useForm } from "../../hooks/UseForm";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch, useSelector, } from "react-redux";
import { AppDispatch, RootState, } from "../../redux/store";
import { verifyUser } from "../../redux/actions/userAction";
import {  ResponseStatus, Role } from "../../interface/Interface";
import { useNavigate } from "react-router-dom";
 
import { formatTime } from "../../utils/format";
import {  isResponseError } from "../../utils/customError";

import { useTimer } from "../../hooks/useTimer";
import ResendOTP from "../../component/ResendOTP";
import { userClearTempMail, userClearError } from "../../redux/reducers/userReducer";
import Toast2, { Toast } from "../../component/Toast2";

const UserOTPVerification: React.FC = (): JSX.Element => {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  
  const { error, tempMail } = useSelector((state:RootState)=>state.user)
  
  const { timeRemaining, isActive, resetTimer ,startTimer} = useTimer(120);

  useEffect(() => {

    if (!tempMail) {
      navigate('/login')
    }
    startTimer()
    dispatch(userClearError())
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {

      event.preventDefault();
      dispatch(userClearTempMail())

    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)

  }, [])

  const { formData, inputError, handleChange, setInputError } = useForm({
    otp: ''
  }, Role.users);


  const [toastMessage, setToastMessage] = useState<Toast | null>(null)
  const clearToast = () => setToastMessage(null)
  const setToast = (toast: Toast) => setToastMessage({ alert: toast.alert, message: toast.message })



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
      if (isResponseError(err)) {
        if (err.statusCode === 403) {
          navigate('/login', { replace: true, state: { blocked: true } });
        } else if (err.statusCode === 400) { 
          setInputError({ [err.data.error]: err.data.message })
        } else {
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1000)

          setToastMessage({
            alert: ResponseStatus.ERROR,
            message: err.data.message
          })
        }
      }
    } finally {

    }

  };
  const backgroundImagePath = { backgroundImage: `url(${backgroundImage})` };

  return (
    <>

      {
        toastMessage &&
        <Toast2
          alert={toastMessage.alert}
          message={toastMessage.message}
          clearToast={clearToast}
        // modalToast={toastMessage}
        />
      }

      <section className="background h-full  md:h-screen overlay flex items-center justify-center " style={backgroundImagePath}>

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

                <ResendOTP isActive={isActive} resetTimer={resetTimer} role={Role.users} setToast={setToast} />

              </div>
              <button className="bg-black rounded-md  text-white py-2  " disabled={timeRemaining === 0} >
                Verify OTP
              </button>
              {isActive&&<div className="mt-2 text-white text-sm text-center">
                Time remaining: {formatTime(timeRemaining)}
              </div>}


            </form>
          </div>
        </div>
      </section >

    </>
  )
}

export default UserOTPVerification