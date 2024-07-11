import React, { useEffect } from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import { useForm } from "../../hooks/UseForm";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { verifyUser } from "../../redux/actions/userAction";
import { ResponseStatus } from "../../interface/Interface";
import { useLocation, useNavigate } from "react-router-dom";
import { clearError } from "../../redux/reducers/userReducer";


export const UserOTPVerification: React.FC = (): JSX.Element => {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const location = useLocation()


  const { error, user } = useSelector((state: RootState) => state.user);

  const { formData, inputError, handleChange, setInputError } = useForm({
    otp: ''
  });

  // useEffect(() => {
  //   dispatch(clearError())
  // }, [ ]);

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (event: React.FormEvent) => {
    try {
      const isValid = handleSubmit(event);
      if (isValid) {

        if (user) {
          const response = await dispatch(verifyUser({ ...formData, email: user[0]?.email })).unwrap();
          if (response.status === ResponseStatus.SUCCESS) {
            navigate(response.redirectURL)
          }
        }

      }
    } catch (err) {
      console.log('verification error :', err, error)
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
                {inputError.otp && <small className='text-red-600 capitalize absolute bottom-0 left-0'>{inputError.otp}</small>}
                {error?.error === 'otp' && <small className='text-red-600 capitalize absolute bottom-0 left-0'>{error.message}</small>}
              </div>
              <button className="bg-black rounded-xl text-white py-2  ">
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </section >

    </>
  )
}