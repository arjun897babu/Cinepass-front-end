import React, { lazy, MouseEvent, useEffect, useRef, useState } from "react"
import AddButton from "../../../component/AddButton"
import { Loader } from "../../../component/Loader"
import { Action, IStreamPlanFilter, IStreamRentalPlan, ResponseStatus, Role } from "../../../interface/Interface"
import { getSerialNumber } from "../../../utils/format"
import { FaEdit } from "react-icons/fa"
import StreamingPlanForm from "../../../component/admin/StreamingPlanForm"
import Toast2, { Toast } from "../../../component/Toast2"
import Pagination from "../../../component/Pagination"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { getStreamPlan } from "../../../redux/actions/adminAction"
import useErrorHandler from "../../../hooks/useErrorHandler"

const EmptyData = lazy(() => import("../../../component/EmptyData"))



const AdminStreamPlan: React.FC = () => {

  /*----------------------------for showing the toast message in the parent page---------------------------- */

  const [toast, setToast] = useState<Toast | null>(null)

  const updateToast = (toast: Toast) => {
    setToast({
      alert: toast.alert,
      message: toast.message
    })
  }
  /*----------------------------for showing the toast message in the parent page---------------------------- */

  const dispatch = useDispatch<AppDispatch>()
  const handleApiError = useErrorHandler(Role.admin, setToast)
  const [loading, setLoading] = useState(false) // state for loading icon

  const [plan, setPlan] = useState<IStreamRentalPlan[]>([]) // storing the streaming plan details


  //pagination
  const [maxPage, setMaxPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filter, setFilter] = useState<Partial<IStreamPlanFilter | null>>(null)

  const handleChangePage = (newPage: number) => {
    setFilter((prev) => (
      {
        ...prev,
        pageNumber: newPage
      }
    ))
    setCurrentPage(newPage)
  }



  const [addForm, setAddForm] = useState<boolean>(false)
  const [editForm, setEditForm] = useState<IStreamRentalPlan | null>(null)

  const modalRef = useRef<HTMLDialogElement | null>(null)//reference to the modal

  //get streaming plan data 

  async function fetchStreamingPlan() {
    setLoading(true)
    try {
      const response = await dispatch(getStreamPlan({ filter })).unwrap()
      if (response.status === ResponseStatus.SUCCESS) {
        setPlan(response.data.data)
        setMaxPage(response.data.maxPage)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStreamingPlan()
  }, [currentPage])

  /*----------------------------for open and close the modal for adding or  editing---------------------------- */

  const showAddPlanForm = () => {
    setAddForm(true)
    if (modalRef.current) {
      modalRef.current.showModal()
    }
  }


  const closePlanForm = () => {
    if (addForm) {
      setAddForm(false)
    } else {
      setEditForm(null)
    }

    if (modalRef.current) {
      modalRef.current.close()
    }
  }
  /*----------------------------for open and close the modal for adding or  editing---------------------------- */

  //for updating a specific streaming plan
  const updatePlan = (e: MouseEvent, planId: string | undefined) => {
    if (modalRef.current) {
      modalRef.current.showModal()
    }
    e.preventDefault()
    if (!planId || !plan) {
      console.log('no plan id is found')
      return
    }

    const selectedPlan = plan.find((item) => item._id === planId)

    if (selectedPlan) {
      setEditForm(selectedPlan)
    }
  }
  //for deleting a specific streaming plan
  // const deleteButtonClicked = (e: MouseEvent, planId: string | undefined) => {
  // e.preventDefault()
  //   if (!planId || !plan) {
  //     console.log('no plan id is found')
  //     return
  //   }
 
  // }

  function updatePlanTable(action: Action) {
    if (action === Action.ADD) {
      if (currentPage !== 1) {
        handleChangePage(1)
      } else {
        fetchStreamingPlan()
      }
    } else {
      fetchStreamingPlan()
    }
  };

  if (loading) return <div className="flex justify-center"><Loader /></div>

  return (
    <>

      <AddButton
        btnColor="bg-sky-400"
        btnText="Add Plan"
        cb={showAddPlanForm}
      />

      {
        toast &&
        <Toast2
          alert={toast.alert}
          clearToast={() => setToast(null)}
          message={toast.message}
        />
      }

      <dialog ref={modalRef} id="my_modal_3" className="modal modal-middle">
        <div className="modal-box">
          <button onClick={closePlanForm} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <h3 className="font-bold text-lg uppercase text-center">{addForm ? Action.ADD : editForm ? Action.UPDATE : ''}</h3>
          {
            addForm &&
            <StreamingPlanForm
              updatePlanState={updatePlanTable}
              closeModal={closePlanForm}
              updateToast={updateToast}
            />
          }

          {
            editForm &&
            <StreamingPlanForm
              updatePlanState={updatePlanTable}
              closeModal={closePlanForm}
              updateToast={updateToast}
              _id={editForm._id}
              defaultData={editForm}
            />
          }

        </div>
      </dialog>


      {
        plan.length > 0 ? (
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="table">
              {/* Table Head */}
              <thead className="font-bold text-black capitalize ">
                <tr>
                  <th>sl No</th>
                  <th>Plan name</th>
                  <th>Plan price</th>
                  <th>Plan validity</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {plan.map((plan, index) => (
                  <tr key={plan._id}>
                    <th>{getSerialNumber(currentPage, index)}</th>
                    <td>
                      <div className="flex items-center gap-3 max-w-60 whitespace-nowrap overflow-hidden">
                        <div>
                          <div className="max-w-60 font-semibold text-black capitalize text-ellipsis whitespace-nowrap overflow-hidden">
                            {plan.planName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge font-bold rounded-none">₹ {plan.price}</span>
                    </td>
                    <td>
                      <span className="badge font-bold rounded-none">{plan.validity} month</span>
                    </td>
                    <td className="flex justify-center items-center gap-3">
                      <button onClick={(e) => updatePlan(e, plan._id)} className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-black">
                        <FaEdit />
                      </button>
                      {/* <button onClick={(e) => deleteButtonClicked(e, plan._id)} className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600">
                        <GiCancel />
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center"><EmptyData /></div>
        )
      }
      {
        maxPage && plan &&
        <div className="flex justify-center mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={maxPage}
            onPageChange={handleChangePage}
          />
        </div>
      }
    </>
  )
}

export default AdminStreamPlan