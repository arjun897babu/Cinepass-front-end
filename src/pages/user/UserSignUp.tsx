
import React, { FormEvent, useEffect } from 'react';
import '../../index.css';
import { Link, useNavigate } from 'react-router-dom'
import backGroundImage from '/Iconic Movie Posters Collage.webp';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { signUpUser } from '../../redux/actions/userAction';
import { useForm } from '../../hooks/UseForm';
import { useFormSubmit } from '../../hooks/UseFormSubmitt';
import { clearUserError } from '../../redux/reducers/userReducer';
import { useLoggedOwner } from '../../hooks/useLoggedUser';
import { ResponseStatus } from '../../interface/Interface';


export const UserSignUp: React.FC = (): JSX.Element => {

  const navigate = useNavigate()

  let background_image_path = { backgroundImage: `url(${backGroundImage})` };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(clearUserError())
  }, [])

  const { error, isAuthenticated } = useLoggedOwner('user');

  const { formData, handleChange, inputError, setInputError } = useForm({
    name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirm_password: ''
  }, 'user')

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (event: FormEvent) => {
    const isValid = handleSubmit(event);


    if (isValid) {

      try {
        const response = await dispatch(signUpUser(formData)).unwrap();
        console.log(response)
        if (response.status === ResponseStatus.SUCCESS) {
          navigate(response.redirectURL)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }


  return (
    <section className="background overlay flex items-center justify-center " style={background_image_path}>

      <div className="flex  p-5 justify-center">

        {/* Image section */}
        <div className="md:block hidden w-1/2">
          <img
            className="right-section h-screen object-cover"
            src={backGroundImage}
          />
        </div>

        {/* Form section */}
        <div className={`md:w-3/5 px-4 sm:px-24   py-24 space-y-8  `}>
          <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-3xl font-black text-center  ">

            Unlock the Magic of Cinema with CinePass

          </h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-1">

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label htmlFor="name">Name</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Name"
              />
              {inputError.name && <small className='text-red-600 capitalize absolute -bottom-2.5 left-3 '>{inputError.name}</small>}
              {error?.error === 'name' && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{error.message}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative ">
              <label htmlFor="email">Email</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Email"
              />
              {inputError.email && <small className='text-red-600 capitalize absolute -bottom-2.5 left-3'>{inputError.email}</small>}
              {error?.error === 'email' && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{error.message}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label htmlFor="mobile_number">Mobile Number</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="string"
                name="mobile_number"
                onChange={handleChange}
                value={formData.mobile_number}
                placeholder="mobile number"
              />
              {inputError.mobile_number && <small className='text-red-600 capitalize absolute -bottom-2.5 left-3'>{inputError.mobile_number}</small>}
              {error?.error === 'mobile_number' && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{error.message}</small>}

            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label htmlFor="password">Password</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
                value={formData.password}
              />
              {inputError.password && <small className='text-red-600 capitalize absolute -bottom-2.5 left-3'>{inputError.password}</small>}
              {error?.error === 'password' && <small className='text-red-600 capitalize absolute -bottom-3 left-3'>{error.message}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-md w-full relative">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
              {inputError.confirm_password && <small className='text-red-600 capitalize absolute -bottom-2.5 left-3'>{inputError.confirm_password}</small>}

            </div>
 
            <button type='submit' className="bg-black  mt-4 rounded-md text-white py-2">
              Register
            </button>

          </form>

          <Link to={`/login`}>
            <div className="mt-3 font-extrabold text-sm flex justify-end text-white">
               Already have an account? 
            </div>
          </Link>
        </div>

      </div>

    </section>
  )
}


