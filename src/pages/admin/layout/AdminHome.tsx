import { lazy, useEffect, useState } from "react"
import { DashBoardCard } from "../../../component/DashBoardCard"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { Loader } from "../../../component/Loader"
import useErrorHandler from "../../../hooks/useErrorHandler"
import { adminGetEntityStat, getAdminStreamRevenue } from "../../../redux/actions/adminAction"
import {
  IGetTheaterOwnersCount,
  IGetUserCount,
  IRevenueResponse,
  Period,
  ResponseStatus,
  RevenueFilter,
  Role
} from "../../../interface/Interface"
const DoughnutChart = lazy(() => import('../../../component/chart/DoughnutChart'))
const BarChart = lazy(() => import("../../../component/chart/BarChart"))

const AdminHome: React.FC = (): JSX.Element => {

  const handleApiError = useErrorHandler(Role.admin)
  const dispatch = useDispatch<AppDispatch>()
  const [streamRevenue, setStreamRevenue] = useState<IRevenueResponse | null>(null)
  const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>({ period: Period.WEEK })
  const changeStreamRevenueFilter = (key: keyof RevenueFilter, value: Period | string) => {
    setRevenueFilter((prevFilter) => (
      {
        ...prevFilter,
        [key]: value
      }
    ))
  }

  const [loading, setLoading] = useState(false)

  const [userStat, setUserStat] = useState<IGetUserCount | null>(null)
  const [theaterStat, setTheaterStat] = useState<IGetTheaterOwnersCount | null>(null)

  async function fetchData() {
    try {
      setLoading(true)
      Promise.all([fetchEntityData(), fetchStreamData()])
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchEntityData() {
    try {

      const response = await dispatch(adminGetEntityStat()).unwrap()

      if (response.status === ResponseStatus.SUCCESS) {
        setUserStat(response.data.userStat)
        setTheaterStat(response.data.theaterStat)
      }
    } catch (error) {
      handleApiError(error)
    }
  }
  async function fetchStreamData() {
    try {

      const response = await dispatch(getAdminStreamRevenue(revenueFilter)).unwrap()

      if (response.status === ResponseStatus.SUCCESS) {
        setStreamRevenue(response.data)
      }
    } catch (error) {
      handleApiError(error)
    }
  }


  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    fetchStreamData()
  }, [revenueFilter])
  if (loading) return <div className=""><Loader /></div>
  return (
    <div className="user-theater">
      <div className="stats gap-2">
        <DashBoardCard header="user" data={userStat?.verified ?? 0} />
        <DashBoardCard header="theaters" data={theaterStat?.verified ?? 0} />
      </div>
      <div className="flex gap-2">
        {
          userStat &&
          < DoughnutChart label="user" chartData={userStat} />
        }
        {
          theaterStat &&
          < DoughnutChart label="theaters" chartData={theaterStat} />
        }
      </div>
      {streamRevenue && <div className="p-1">
        <BarChart revenue="stream" changeFilter={changeStreamRevenueFilter} data={streamRevenue} />
      </div>}
    </div>
  )
}

export default AdminHome