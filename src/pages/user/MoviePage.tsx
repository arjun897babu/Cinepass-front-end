const MoviePage: React.FC = () => {
  return (
    <>
      {/* movie section  */}
      <section
        className="relative  bg-size-100-100 sm:w-full p-8 flex bg-no-repeat  bg-center justify-center items-center min-h-[480px] bg-"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(26, 26, 26) 24.97%, rgb(26, 26, 26) 38.3%, rgba(26, 26, 26, 0.04) 97.47%, rgb(26, 26, 26) 100%),  url('https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/deadpool-and-wolverine-et00341295-1718018322.jpg')",
        }}
      >


        {/* movie card  */}
        <div className="flex   max-w-[1240px] mx-auto relative w-full bg-transparent border-0 text-base font-normal m-0 p-0 align-baseline">
          <div className="bg-transparent border-0 text-base font-normal m-0 p-0 align-baseline w-[261px] h-[416px] overflow-hidden flex-shrink-0 flex justify-center items-center">
            <img className="w-auto h-96" src="https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/deadpool-and-wolverine-et00341295-1718018322.jpg" alt="" />
          </div>
          <div className="p-8" >
            <h1 className="relative text-white capitalize font-bold text-3xl">DeadPool and wolverine</h1>
            <div className="mt-4 flex items-center justify-between rounded-none bg-stone-800   w-full p-2">
              <div></div>
              <button className="btn   relative">Rate Now</button>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="badge rounded-sm font-sans p-4  ">2D</span>
              <span className="badge rounded-sm font-sans p-4  ">Malayalam,Tamil</span>
            </div>
            <div className="mt-4 gap-3 flex relative">
              <span className="text-lg text-white ">2h 4m</span>
              <span className="rounded bg-white p-[1px]"></span>
              <span className="text-lg text-white ">Action,Comedy</span>
              <span className="rounded bg-white p-[1px]"></span>
              <span className="text-lg text-white ">13  07 2024</span>
            </div>
          </div>

        </div>
        {/* movie card  */}
      </section>
      {/* movie section  */}
      <div className="p-4 ml-4 " >
        <h2 className="text-2xl mb-3 font-sans font-bold">About The Movie</h2>
        <p>Wolverine is recovering from his injuries when he meets the loudmouth, Deadpool. They team up to defeat a common enemy.</p>
        <hr className='mt-3' />
      </div>

      {/* show detail */}
      <div className="w-full  p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 justify-between">
          {/* Theater Name */}
          <div className="col-span-1 ">
            <div className="text-left lg:text-left mb-4">
              <h2 className="text-lg font-semibold">Magic Frames Radha 2K UHD 3D 7.1, Calicut</h2>
            </div>
          </div>

          {/* Show Buttons */}
          <div className="col-span-1 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white border border-gray-300 rounded-md  flex flex-col items-center">
              <span className="text-green-500 text-xl font-bold">9:00 PM</span>
              <span className="text-gray-500 text-sm">AUDI 1</span>
            </button>
            <button className="bg-white border border-gray-300 rounded-md  flex flex-col items-center">
              <span className="text-green-500 text-xl font-bold">9:00 PM</span>
              <span className="text-gray-500 text-sm">AUDI 2</span>
            </button>
            <button className="bg-white border border-gray-300 rounded-md  flex flex-col items-center">
              <span className="text-green-500 text-xl font-bold">9:00 PM</span>
              <span className="text-gray-500 text-sm">AUDI 3</span>
            </button>
            <button className="bg-white border border-gray-300 rounded-md  flex flex-col items-center">
              <span className="text-green-500 text-xl font-bold">9:00 PM</span>
              <span className="text-gray-500 text-sm">AUDI 4</span>
            </button>
            {/* Add more buttons as needed */}
          </div>
        </div>
      </div>

    </>
  )
}

export default MoviePage