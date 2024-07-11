
import React from 'react';
import '../../index.css';
import { Link } from 'react-router-dom'
import backGroundImage from '/movie_projector.jpg'



export const TheatersLogin: React.FC = (): JSX.Element => {

  let background_image_path = { backgroundImage: `url(${backGroundImage})` };

  return (

    <section className="background overlay flex items-center justify-center " style={background_image_path}>

      <div className="flex rounded-2xl p-5 justify-center">

        <div className={`relative md:w-3/5 px-8 md:px-24 py-24 space-y-8 bg-black bg-opacity-50`}>
          

          <h1 className=" mt-2   bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-600 text-3xl  font-black text-center  ">
            
            Empower Your Movie Management with CinePass
            

          </h1>
          {/* form */}
          <form action="" className="flex flex-col gap-1 ">

            <div className="p-2 mt-1 text-white rounded-xl w-full ">
              <label htmlFor="email">Email</label>
              <input
                className="p-2 mt-3 text-black rounded-xl w-full focus:outline"
                type="email"
                name="email"
                placeholder="Email"
              />
            </div>
            <div className="p-2 mt-1  text-white rounded-xl w-full ">
              <label htmlFor="Password">Password</label>
              <input
                className="p-2 mt-3  text-black rounded-xl w-full focus:outline"
                type="password"
                name="password"
                placeholder="password"
              />
            </div>

            
              <div className="flex justify-end">
                <button className="  mt-5 text-xs text-white">
                  Forgot password?
                </button>
              </div> 


            <button className="bg-black rounded-xl text-white py-2  ">
              Login
            </button>
          </form>

          {/* form */}

         
            <>
              {/* ------------------------------------------ */}
              < div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                <hr className="border-gray-400" />
                <p className="text-center text-sm">OR</p>
                <hr className="border-gray-400" />
              </div>
              {/* ------------------------------------------ */}

              <Link to={`/theaters/signUp`}>
                <div className="mt-3 text-xs flex justify-end   text-black">
                  <span className='bg-white px-5 py-2 rounded-xl'>Don't have an account?</span>
                  <button className="py-2 px-5 bg-black  text-white rounded-xl  ">
                    Register
                  </button>
                </div>
              </Link>


              <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm   text-black">
                <svg
                  className="mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="25px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Google
              </button>

            </> 


        </div>
       
         
      </div>
    </section >
  )
}

 