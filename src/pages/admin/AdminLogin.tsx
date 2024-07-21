
import React, { FormEvent, useEffect } from 'react';
import '../../index.css';
import backGroundImage from '/Iconic Movie Posters Collage.webp';
import { useForm } from '../../hooks/UseForm';
import { useFormSubmit } from '../../hooks/UseFormSubmitt';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../redux/actions/adminAction';
import { ResponseStatus, Role } from '../../interface/Interface';
import { isErrorResponse } from '../../utils/customError';
import { useLoggedOwner } from '../../hooks/useLoggedUser';
import { clearAdminError } from '../../redux/reducers/adminReducer';

export const AdminLogin: React.FC = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { error, isAuthenticated } = useLoggedOwner(Role.admin)
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(clearAdminError())
  }, [])
  const { formData, inputError, setInputError, handleChange } = useForm({
    email: '',
    password: ''
  },Role.admin);

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const onSubmit = async (e: FormEvent) => {
    try {
      const isValid = handleSubmit(e);

      if (isValid) {
        const response = await dispatch(loginAdmin(formData)).unwrap()
        console.log(response)
        if (response.status == ResponseStatus.SUCCESS) {
          navigate(response.redirectURL)
        }
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.log(error)
      }
    }

  }

  let backGroundImagePath = { backgroundImage: `url(${backGroundImage})` }
  return (

    <section className="background overlay flex items-center justify-center " style={backGroundImagePath}>

      <div className="flex rounded-2xl p-5 justify-center">

        <div className={`relative md:w-3/5 px-8 md:px-24 py-24 space-y-8  `}>


          <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-3xl  font-black text-center  ">
            Empower Your Movie Management with CinePass
          </h1>
          {/* form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-1 ">

            <div className="p-2 mt-1 text-white rounded-md w-full relative ">
              <label htmlFor="email">Email</label>
              <input
                className="p-2 mt-3 text-black rounded-md w-full focus:outline"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              {inputError?.email && <span className='text-red-600 capitalize absolute left-3 -bottom-4 font-mono text-sm ' >{inputError?.email}</span>}
              {error?.error === 'email' && <span className='text-red-600 capitalize absolute left-3 -bottom-4 font-mono text-sm '>{error.message}</span>}

            </div>
            <div className="p-2 mt-1  text-white rounded-md w-full relative">
              <label htmlFor="Password">Password</label>
              <input
                className="p-2 mt-3  text-black rounded-md w-full focus:outline"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="password"
              />
              {inputError?.password && <span className='text-red-600 capitalize absolute left-3 -bottom-4 font-mono text-sm ' >{inputError?.password}</span>}
              {error?.error === 'password' && <span className='text-red-600 capitalize absolute left-3 -bottom-4 font-mono text-sm '>{error.message}</span>}
            </div>


            <button className="bg-black rounded-md mt-4 text-white py-2  ">
              Login
            </button>
          </form>

          {/* form */}



        </div>
        {/* image */}
        <div className="md:block hidden w-1/2">
          <img
            className="right-section rounded-2xl h-screen object-cover "
            src={backGroundImage}
          />
        </div>
      </div>
    </section >
  )
}

