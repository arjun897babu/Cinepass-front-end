import { ITheaterDetailResponse } from "../../interface/theater/ITheaterDetail"
import TheaterUpdateForm from "./TheaterUpdateForm"

export const TheaterInfo: React.FC<{ data: ITheaterDetailResponse }> = ({ data }) => {
  return (
    <>
      <div className="w-full">
        <div className="flex mb-3 justify-end">
          <TheaterUpdateForm data={data} />
        </div>
        <div className="flex flex-col px-8 pt-10 pb-2 rounded-md border bg-gray-100 border-black border-solid w-full max-md:px-5">
          <div className="max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-[28%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow text-sm font-light leading-4 text-black max-md:mt-7">
                  <img
                    src={data.images[0] ?? "https://img.freepik.com/premium-vector/photo-coming-soon_77760-116.jpg?w=740"}
                    className="self-center border border-black border-solid aspect-[1.22] w-[206px]"
                  />

                </div>
              </div>
              <div className="flex flex-col ml-5 w-[72%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col self-stretch my-auto text-black max-md:mt-10 max-md:max-w-full">
                  <h1 className="text-2xl font-medium leading-8 max-md:max-w-full">
                    {data.theater_Name}
                  </h1>
                  <div className="flex gap-5 justify-between self-start mt-11 text-sm font-light leading-4 whitespace-nowrap max-md:mt-10">
                    <p className="self-start">{data.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-5 justify-between mt-2.5 ml-5 w-full font-light leading-[120%] max-md:flex-wrap max-md:max-w-full">
            <div className="flex flex-col">
              <div className="flex gap-5 self-start text-sm text-black">
                <h1 className="flex-auto">License Number</h1>
                <>:</>
                <span>{data.theater_license}</span>
              </div>
              <div className="flex gap-5 self-start text-sm text-black">
                <h1 className="flex-auto">Number of Screens</h1>
                <>:</>
                <span>0</span>
              </div>
            </div>

            <div className="flex gap-5 justify-between items-start text-xs">

              <button className="flex flex-col px-5 justify-center items-center cursor-not-allowed py-1.5 text-white bg-pink-700 rounded-xl border border-black border-solid max-md:pl-5">
                <span className="font-semibold" >Under maintenance</span>
                <span className="mt-1.5">0</span>
              </button>
              <button className="flex justify-center items-center flex-col px-5 cursor-not-allowed py-1.5 text-black bg-neutral-500 rounded-xl border border-black border-solid max-md:pl-5">
                <span className="font-semibold" >Screens Available</span>
                <span className="mt-1.5">0</span>
              </button>
            </div>
          </div>
            <div className="carousel carousel-center mb-3  justify-center space-x-2 w-full p-2 mt-4">
              {data.images.map((img, index: number) => (
                <div key={index} className="carousel-item border border-slate-400 h-48 w-48 relative">
                  <img src={img} className=" h-full w-full object-cover" />
                </div>
              ))}
            </div>
        </div>
      </div>

    </>

  )
}


