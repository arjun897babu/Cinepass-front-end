
import { useEffect, useState } from "react"
import PurchaseDetailModal from "../../../component/user/PurchaseDetailModal"
import PurchaseSummary from "../../../component/user/PurchaseSummary"
import { PurchasedItem } from "../../../interface/Interface"
import { IPayment } from "../../../interface/user/IPayment"


const TicketSummary = () => {

  const [selected, setSelected] = useState<IPayment | null>(null)
  const viewSelected = (paymentId: string) => {
    // setSelected()
  }

  async function fetchPaymentData() {
    try {

    } catch (error) {

    }
  }

  useEffect(() => {
    fetchPaymentData()
  }, [])


  return (
    <>
      <div className="  p-2  m-2  ">
        <PurchaseSummary
          purchasedItem={PurchasedItem.TICKET}
          setSelected={viewSelected}
        />
      </div>

      {
        selected &&
        <PurchaseDetailModal
          closeModal={() => setSelected(null)}
        />
      }


    </>
  )
}

export default TicketSummary