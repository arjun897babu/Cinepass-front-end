import { TheaterProfile } from "../../interface/theater/ITheaterOwner"
import TheaterUpdateForm, { TheaterProps } from "./TheaterUpdateForm"



const TheaterInfo: React.FC<TheaterProps> = ({ selectedData, setTheaterDataResponse, setToast }) => {
  return (
    <>

      <div className="card bg-base-100   shadow-xl relative">
        <div className="absolute right-2 top-2">
          <TheaterUpdateForm
            selectedData={selectedData}
            setTheaterDataResponse={setTheaterDataResponse}
            setToast={setToast}
          />
        </div>
        <figure className="px-10 pt-10">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center ">
          <h2 className="max-w-full break-words text-2xl font-bold ">{selectedData.theater_name}</h2>
          <p>{selectedData.address}</p>
          <p>{selectedData.city}</p>
        </div>
      </div>
      
    </>
  )
}

export default TheaterInfo