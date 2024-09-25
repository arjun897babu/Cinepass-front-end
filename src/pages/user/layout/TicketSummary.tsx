
import { useEffect, useState } from "react"
import PurchaseDetailModal from "../../../component/user/PurchaseDetailModal"
import PurchaseSummary from "../../../component/user/PurchaseSummary"
import { IUserTicketData, PurchasedItem, ResponseStatus, Role } from "../../../interface/Interface"
import { IPayment } from "../../../interface/user/IPayment"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { getUserTickets } from "../../../redux/actions/userAction"
import { isErrorResponse, isResponseError } from "../../../utils/customError"
import useErrorHandler from "../../../hooks/useErrorHandler"
import EmptyData from "../../../component/EmptyData"
import { Loader } from "../../../component/Loader"


const TicketSummary = () => {
  const dispatch = useDispatch<AppDispatch>()
  const handleApiError = useErrorHandler(Role.users)
  const [loading, setLoading] = useState(false)

  const [ticketData, setTicketData] = useState<IUserTicketData[] | null>(null)
  const [selected, setSelected] = useState<IUserTicketData | null>(null)

  const viewSelected = (paymentId: string) => {
    if (ticketData) {
      const selected = ticketData.find((item) => item.paymentInfo.paymentIntentId === paymentId)
      console.log(selected);
      selected ?
        setSelected(selected)
        : null
    }
  }

  async function fetchPaymentData() {
    setLoading(true)
    try {
      const response = await dispatch(getUserTickets({})).unwrap()
      console.log(response.data.data)
      if (response.status === ResponseStatus.SUCCESS) {
        setTicketData(response.data.data)
      }

    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === 404) {
          setTicketData([])
        }

      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentData()
  }, [])

  if (ticketData && !ticketData.length) return <div className="flex justify-center p-2 m-2"><EmptyData /></div>

  return (
    <>
      <div className="p-2 m-2">
        {loading ? (
          <div className="flex-grow flex justify-center items-center">
            <span className="loading  loading-md text-info"></span>
          </div>
        ) : (
          <>
            {ticketData && ticketData.length > 0 && (
              ticketData.map((item) => (
                <PurchaseSummary
                  data={{
                    movieInfo: item.movieInfo,
                    paymentInfo: item.paymentInfo,
                    TicketInfo: item.TicketInfo,
                    showInfo: item.showInfo
                  }}
                  key={item.TicketInfo._id}
                  purchasedItem={PurchasedItem.TICKET}
                  setSelected={viewSelected}
                />
              ))
            )}
          </>
        )}
      </div>

      {selected && (
        <PurchaseDetailModal role={Role.users} data={selected} closeModal={() => setSelected(null)} />
      )}
    </>
  );
}
export default TicketSummary