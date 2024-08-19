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
          {/* <img
            src="https://www.hollywoodreporter.com/wp-content/uploads/2023/04/Samsung-Onyx-at-Star-Cinema-Grill_094128-H-2023.jpg?w=1296&h=730&crop=1"
            alt="Shoes"
            className="rounded-xl" /> */}
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