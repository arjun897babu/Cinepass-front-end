import React, { useEffect, useState } from "react"
import backgroundImage from '/movie_projector.jpg'
import { useForm } from "../../hooks/UseForm";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

import { ResponseData, ResponseStatus, Role } from "../../interface/Interface";
import { useNavigate } from "react-router-dom";
import { useLoggedOwner } from "../../hooks/useLoggedUser";
import { clearTheaterError } from "../../redux/reducers/theatersReducer";
import { verifyOTPTheaters } from "../../redux/actions/theaterAction";
import { formatTime } from "../../utils/fromat";
import ResendOTP from "../../component/ResendOTP";
import { useTimer } from "../../hooks/useTimer";
import Toast from "../../component/Toast";



export const TheaterOTPVerification: React.FC = (): JSX.Element => {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  const { error, tempMail, } = useLoggedOwner(Role.theaters)

  const [response, setResponse] = useState<ResponseData | null>(null)
  const { isActive, resetTimer, timeRemaining } = useTimer(5)


  const { formData, inputError, handleChange, setInputError } = useForm({
    otp: ''
  }, Role.theaters);

  useEffect(() => {
    dispatch(clearTheaterError())
  }, []);

  const { handleSubmit } = useFormSubmit(formData, setInputError);
 
  const onSubmit = async (event: React.FormEvent) => {

    try {
      const isValid = handleSubmit(event);
      if (isValid) {

        if (tempMail) {
          const response = await dispatch(verifyOTPTheaters({ ...formData, email: tempMail.email })).unwrap();
          console.log('log from otp theater verify page', response)
          if (response.status === ResponseStatus.SUCCESS) {
            console.log(response.redirectURL)
            navigate(response.redirectURL)
          }
        } else {
          navigate('/theaters/login')
        }

      }
    } catch (err) {
      console.log('verification error :', err)
    }

  };
  const backgroundImagePath = { backgroundImage: `url(${backgroundImage})` };

  return (
    <>


      <section className="background  md:h-screen overlay flex items-center justify-center " style={backgroundImagePath}>
      {response && <Toast status={response?.status} message={response?.message} role={Role.users} />}
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

                <ResendOTP isActive={isActive} resetTimer={resetTimer} role={Role.theaters} setResponse={setResponse} />

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