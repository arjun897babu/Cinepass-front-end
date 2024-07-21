import React, { useEffect } from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import { useForm } from "../../hooks/UseForm";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { verifyUser } from "../../redux/actions/userAction";
import { ResponseStatus, Role } from "../../interface/Interface";
import { useLocation, useNavigate } from "react-router-dom";
import { clearUserError } from "../../redux/reducers/userReducer";
import { useLoggedOwner } from "../../hooks/useLoggedUser";



const UserOTPVerification: React.FC = (): JSX.Element => {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const location = useLocation()

  const { error, isAuthenticated, tempMail } = useLoggedOwner(Role.users);
  console.log(error)

  const { formData, inputError, handleChange, setInputError } = useForm({
    otp: ''
  }, Role.users);

  useEffect(() => {
    dispatch(clearUserError())
  }, []);

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (event: React.FormEvent) => {
    console.log('onsubmit working')
    try {
      const isValid =   handleSubmit(event);
      if (isValid) {

        console.log(tempMail)
        if (tempMail) {
           
            const response = await dispatch(verifyUser({ ...formData, email: tempMail.email })).unwrap();
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
              <button className="bg-black rounded-md  text-white py-2  ">
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </section >

    </>
  )
}

export default UserOTPVerification