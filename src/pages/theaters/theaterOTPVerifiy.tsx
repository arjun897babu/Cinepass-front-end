import React, { useEffect, useState } from "react"
import backgroundImage from '/movie_projector.jpg'
import { useForm } from "../../hooks/UseForm";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";

import {  ResponseStatus, Role } from "../../interface/Interface";
import { useNavigate } from "react-router-dom";
 

import { verifyOTPTheaters } from "../../redux/actions/theaterAction";
import { formatTime } from "../../utils/format";
import ResendOTP from "../../component/ResendOTP";
import { useTimer } from "../../hooks/useTimer";
import {  isResponseError } from "../../utils/customError";
import { theaterClearError, TheaterClearTempMail } from "../../redux/reducers/theatersReducer";
import Toast2, { Toast } from "../../component/Toast2";




export const TheaterOTPVerification: React.FC = (): JSX.Element => {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  const { error, tempMail, } =  useSelector((state:RootState)=>state.theaters)


  const { isActive, resetTimer, timeRemaining } = useTimer(120)
  const [toastMessage, setToastMessage] = useState<Toast | null>(null)
  const clearToast = () => setToastMessage(null)
  const setToast = (toast: Toast) => setToastMessage({ alert: toast.alert, message: toast.message })

  const { formData, inputError, handleChange, setInputError } = useForm({
    otp: ''
  }, Role.theaters);

  useEffect(() => {

    if (!tempMail) {
      navigate('/theaters/login', { replace: true })
    }

    dispatch(theaterClearError())
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      dispatch(TheaterClearTempMail())
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)

  }, [])

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (event: React.FormEvent) => {

    try {
      const isValid = handleSubmit(event);
      if (isValid) {

        if (tempMail) {
          const response = await dispatch(verifyOTPTheaters({ ...formData, email: tempMail.email })).unwrap();
          if (response.status === ResponseStatus.SUCCESS && response.redirectURL) {
            navigate(response.redirectURL, { replace: true, state: { verified: true } })
          }
        }
      }
    } catch (err) {
      console.log(err)
      if (isResponseError(err)) {
        if (err.statusCode === 403) {
          navigate('/theaters/login', { replace: true, state: { blocked: true } });
        } else if (err.statusCode === 400) {
          console.log(err.data)
          setInputError({ [err.data.error]: err.data.message })
        } else {
          setTimeout(() => {
            navigate('/theaters/login', { replace: true });
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

      <section className="background  md:h-screen overlay flex items-center justify-center " style={backgroundImagePath}>
        <div className="flex rounded-2xl p-5 justify-center">

          <div className={`relative px-8 md:px-24 py-24 space-y-8 bg-black bg-opacity-50`}>


            <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-green-600 text-sm  font-extrabold text-center  ">

              OTP has been send to your email account ! Please verify

            </h1>
            {/* form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-1 ">


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
                {inputError.otp && <small className='text-red-600 capitalize absolute -bottom-4 left-3 font-mono'>{inputError.otp}</small>}
                {error?.error === 'otp' && <small className='text-red-600 capitalize absolute -bottom-4 left-3 font-mono'>{error.message}</small>}
              </div>
              <div className="flex justify-end mb-2">

                <ResendOTP isActive={isActive} resetTimer={resetTimer} role={Role.theaters} setToast={setToast} />

              </div>
              <button className="bg-black rounded-md mt-6 text-white py-2  ">
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