import React from "react"
import backgroundImage from '/Iconic Movie Posters Collage.webp'
import { useForm } from "../../hooks/UseForm";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";


export const UserOTPVerification: React.FC = (): JSX.Element => {
  // const dispatch = useDispatch<AppDispatch>()
  const { error, loading } = useSelector((state: RootState) => state.user);
  console.log('otp veification',error,loading)
  const { formData, inputError, handleChange, setInputError } = useForm({
    otp: ''
  });

  const { handleSubmit } = useFormSubmit(formData, inputError, setInputError);

  const onSubmit = (event: React.FormEvent) => {
   const  isValid=  handleSubmit(event);
    if (isValid) {
      // dispatch((formData)).then((result) => {
      //   console.log('response in submitting', result);
      // });
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