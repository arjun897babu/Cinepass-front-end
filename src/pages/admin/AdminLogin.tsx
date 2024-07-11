
import React from 'react';
import '../../index.css';
import backGroundImage from '/Iconic Movie Posters Collage.webp';

export const AdminLogin: React.FC = (): JSX.Element => {

  let backGroundImagePath = { backgroundImage: `url(${backGroundImage})` }
  return (

    <section className="background overlay flex items-center justify-center " style={backGroundImagePath}>

      <div className="flex rounded-2xl p-5 justify-center">

        <div className={`relative md:w-3/5 px-8 md:px-24 py-24 space-y-8  `}>


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


            <button className="bg-black rounded-xl text-white py-2  ">
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

 