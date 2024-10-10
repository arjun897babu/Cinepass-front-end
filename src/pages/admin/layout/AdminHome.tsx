import { lazy, useEffect, useState } from "react"
const DoughnutChart = lazy(() => import('../../../component/chart/DoughnutChart'))
import { DashBoardCard } from "../../../component/DashBoardCard"
import useErrorHandler from "../../../hooks/useErrorHandler"
import { IGetTheaterOwnersCount, IGetUserCount, ResponseStatus, Role } from "../../../interface/Interface"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { adminGetEntityStat } from "../../../redux/actions/adminAction"

const AdminHome: React.FC = (): JSX.Element => {

  const handleApiError = useErrorHandler(Role.admin)
  const dispatch = useDispatch<AppDispatch>()

  const [loading, setLoading] = useState(false)

  const [userStat, setUserStat] = useState<IGetUserCount | null>(null)
  const [theaterStat, setTheaterStat] = useState<IGetTheaterOwnersCount | null>(null)

  async function fetchData() {
    try {
      setLoading(true)
      await fetchEntityData()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchEntityData() {
    try {
      setLoading(true)
      const response = await dispatch(adminGetEntityStat()).unwrap()

      if (response.status === ResponseStatus.SUCCESS) {
        setUserStat(response.data.userStat)
        setTheaterStat(response.data.theaterStat)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(true)
    }
  }


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="user-theater">
      <div className="stats gap-2">
        {
          <>
            <DashBoardCard header="user" data={userStat?.verified ?? 0} />
            <DashBoardCard header="theaters" data={theaterStat?.verified ?? 0} />
          </>
        }
      </div>
      <div className="flex gap-2">
        {
          userStat &&
          < DoughnutChart chartData={userStat} />
        }
        {
          theaterStat &&
          < DoughnutChart chartData={theaterStat} />
        }
      </div>
    </div>
  )
}

export default AdminHome