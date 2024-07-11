
import React from 'react';
import '../../index.css';
import { Link } from 'react-router-dom'
import backGroundImage from '/movie_projector.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useForm } from '../../hooks/UseForm';
import { useFormSubmit } from '../../hooks/UseFormSubmitt';




export const TheatersSignUp: React.FC = (): JSX.Element => {

  let background_image_path = { backgroundImage: `url(${backGroundImage})` };

  const dispatch = useDispatch<AppDispatch>();

  const { error, loading } = useSelector((state: RootState) => state.theater);

  console.log('states in the theater login page', error, loading)

  const { formData, handleChange, inputError, setInputError } = useForm({
    name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirm_password: '',
    adhaar_number: '',
    theater_license: '',
  });
  console.log('theater form data', formData);

  const { handleSubmit } = useFormSubmit(formData, setInputError);





  return (
    <section className="background overlay flex items-center justify-center " style={background_image_path}>

      <div className="flex rounded-2xl p-5 justify-center">


        {/* Form section */}
        <div className={`md:w-3/4 px-8 md:px-24 py-24 space-y-8    bg-black bg-opacity-30 `}>
          <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-3xl font-black text-center  ">

            Empower Your Movie Management with CinePass


          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-1">

            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="name">Name</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
              {inputError.name && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 '>{inputError.name}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="email">Email</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
              />
              {inputError.email && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 '>{inputError.email}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="mobile_number">Mobile Number</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="number"
                name="mobile_number"
                placeholder="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
              />
              {inputError.mobile_number && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 '>{inputError.mobile_number}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="password">Password</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {inputError.password && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 '>{inputError.password}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
              {inputError.confirm_password && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 '>{inputError.confirm_password}</small>}
            </div>
            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="adhaar_number">adhaar number</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="password"
                name="adhaar_number"
                placeholder="adhaar number"
                value={formData.adhaar_number}
                onChange={handleChange}
              />
              {inputError.adhaar_number && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 '>{inputError.adhaar_number}</small>}
            </div>

            <div className="p-2 mt-1 text-white rounded-xl w-full relative">
              <label htmlFor="theater_license">theater license number</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="password"
                name="theater_license"
                placeholder="theater license number"
                value={formData.theater_license}
                onChange={handleChange}
              />
              {inputError.theater_license && <small className='text-red-600 capitalize absolute left-3 -bottom-3.5 '>{inputError.theater_license}</small>}
            </div>

            <button className="bg-black rounded-xl text-white py-2">
              Register
            </button>

          </form>

          <Link to={`/theaters/login`}><div className="mt-3 text-xs flex justify-end text-white">
            <span className='bg-black px-5 py-2 rounded-xl'>Already have an account?</span>
            <button className="py-2 px-5 bg-white text-black rounded-xl">
              Login
            </button>
          </div>
          </Link>
        </div>

      </div>

    </section>
  )
}

