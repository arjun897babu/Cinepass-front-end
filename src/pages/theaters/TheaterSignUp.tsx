
import React, { FormEvent, useEffect } from 'react';
import '../../index.css';
import { Link, useNavigate } from 'react-router-dom'
import backGroundImage from '/movie_projector.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useForm } from '../../hooks/UseForm';
import { useFormSubmit } from '../../hooks/UseFormSubmitt';
import { signupTheaters } from '../../redux/actions/theaterAction';
import { ResponseStatus } from '../../interface/Interface';
import { isErrorResponse } from '../../utils/customError';
import { useLoggedOwner } from '../../hooks/useLoggedUser';
import { clearTheaterError } from '../../redux/reducers/theatersReducer';




export const TheatersSignUp: React.FC = (): JSX.Element => {

  let background_image_path = { backgroundImage: `url(${backGroundImage})` };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { loading, error } = useLoggedOwner('theater');


  useEffect(() => {
    dispatch(clearTheaterError())
  }, [])

  console.log('states in the theater login page', error, loading)

  const { formData, handleChange, inputError, setInputError } = useForm({
    name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirm_password: '',
    adhaar_number: '',
    theater_name: '',
    theater_license: '',
  },'theater');
  console.log('theater form data', formData);

  const { handleSubmit } = useFormSubmit(formData, setInputError);


  const onSubmit = async (e: FormEvent) => {
    const isValid = handleSubmit(e)
    try {
      if (isValid) {
        const result = await dispatch(signupTheaters(formData)).unwrap();
        if (result.status === ResponseStatus.SUCCESS) {
          navigate(result.redirectURL)
        }
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.log('theater signup error', error)
      }
    }

  }


  return (
    <section className="background overlay flex items-center justify-center " style={background_image_path}>

      <div className="flex  p-5 justify-center">


        {/* Form section */}
        <div className={`md:w-3/4 px-8 md:px-24 py-24 space-y-8    bg-black bg-opacity-30 `}>
          <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-3xl font-black text-center  ">

            Empower Your Movie Management with CinePass


          </h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-1">

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label className='capitalize' htmlFor="name">Name</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
              {inputError.name && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.name}</small>}
              {error?.error === 'name' && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{error.message}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label className='capitalize' htmlFor="email">Email</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
              />
              {inputError.email && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.email}</small>}
              {error?.error === 'email' && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{error.message}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label className='capitalize' htmlFor="mobile_number">Mobile Number</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="text"
                name="mobile_number"
                placeholder="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
              />
              {inputError.mobile_number && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.mobile_number}</small>}
              {error?.error === 'mobile_number' && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{error.message}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label className='capitalize' htmlFor="password">Password</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {inputError.password && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.password}</small>}
              {error?.error === 'password' && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{error.message}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label className='capitalize' htmlFor="confirm_password">Confirm Password</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
              {inputError.confirm_password && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.confirm_password}</small>}
            </div>
            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label className='capitalize' htmlFor="adhaar_number">adhaar number</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="text"
                name="adhaar_number"
                placeholder="adhaar number"
                value={formData.adhaar_number}
                onChange={handleChange}
              />
              {inputError.adhaar_number && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.adhaar_number}</small>}
              {error?.error === 'adhaar_number' && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{error.message}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label className='capitalize ' htmlFor="theater_license">theater license number</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="text"
                name="theater_license"
                placeholder="theater license number"
                value={formData.theater_license}
                onChange={handleChange}
              />
              {inputError.theater_license && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.theater_license}</small>}
              {error?.error === 'theater_license' && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{error.message}</small>}
            </div>
            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="theater_license">Theater Name</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="text"
                name="theater_name"
                placeholder="theater license number"
                value={formData.theater_name}
                onChange={handleChange}
              />
              {inputError.theater_name && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.theater_name}</small>}
              {inputError.theater_name && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 font-mono '>{inputError.theater_name}</small>}
            </div>

            <button className="bg-white rounded-md text-black mt-6 hover:bg-gray-600 py-2">
              Register
            </button>

          </form>

          <div className="mt-3 text-xs flex justify-end items-center text-white  ">
              <span className='  px-5 py-2 rounded-md'>Don't have an account?</span>
              <Link to={`/theaters/login`}>
                <button className="py-2 px-5 bg-white text-black rounded-md">
                  Login
                </button>
              </Link>
            </div>
        </div>

      </div>

    </section>
  )
}

