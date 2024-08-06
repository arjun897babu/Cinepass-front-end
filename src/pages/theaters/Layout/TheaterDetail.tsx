import { useEffect, useState } from "react"
import { TheaterInfo } from "../../../component/theaters/TheaterInfo"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { getTheaterDetails } from "../../../redux/actions/theaterAction"
import { ITheaterDetailResponse } from "../../../interface/theater/ITheaterDetail"

const TheaterDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [theaterData, setTheaterData] = useState<ITheaterDetailResponse | null>(null);

  const fetchTheaterDetails = async () => {
    try {
      const response = await dispatch(getTheaterDetails()).unwrap();
      setTheaterData(response);
    } catch (error) {
      console.log(error)
    }
  }

  const setTheaterDataResponse = (updatedData: ITheaterDetailResponse) => {
    setTheaterData(updatedData);
  };

  useEffect(() => {
    fetchTheaterDetails()
  }, [dispatch])

  return (
    <>
      {
        theaterData &&
        <TheaterInfo data={theaterData} setTheaterDataResponse={setTheaterDataResponse} />
      }
    </>
  )
}

export default TheaterDetail