import React, { useEffect, useState } from "react"
import backgroundImage from '/movie_projector.jpg'
import { useForm } from "../../hooks/UseForm";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

import { ResponseStatus } from "../../interface/Interface";
import { useNavigate } from "react-router-dom";
import { useLoggedOwner } from "../../hooks/useLoggedUser";
import { changeLoading, clearError } from "../../redux/reducers/theatersReducer";
import { verifyOTPTheaters } from "../../redux/actions/theaterAction";



export const TheaterOTPVerification: React.FC = (): JSX.Element => {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  const { error, isAuthenticated, tempMail, loading } = useLoggedOwner('theater')



  const { formData, inputError, handleChange, setInputError } = useForm({
    otp: ''
  });

  useEffect(() => {
    dispatch(clearError())
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

        <div className="flex rounded-2xl p-5 justify-center">

          <div className={`relative px-8 md:px-24 py-24 space-y-8 bg-black bg-opacity-50`}>


            <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-green-600 text-sm  font-extrabold text-center  ">

              OTP has been send to your email account ! Please verify

            </h1>
            {/* form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-1 ">


              <div className="p-2 mt-1  text-white rounded-xl w-full relative ">
                <label htmlFor="otp">Enter Your OTP</label>
                <input
                  className="p-2 mt-3  text-black rounded-xl w-full focus:outline"
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
                {inputError.otp && <small className='text-red-600 capitalize absolute -bottom-4 left-3 font-mono'>{inputError.otp}</small>}
                {error?.error === 'otp' && <small className='text-red-600 capitalize absolute -bottom-4 left-3 font-mono'>{error.message}</small>}
              </div>
              <button className="bg-black rounded-xl mt-6 text-white py-2  ">
                Verify OTP
              </button>
              <div className="mt-2 text-white text-sm text-center">
                Time remaining: {''}
              </div>
            </form>
          </div>
        </div>
      </section >

    </>
  )
}