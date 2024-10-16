import React, { ChangeEvent, MouseEvent, useEffect,  useState } from "react"
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { getEntityDataForAdmin, manageEntitiesByAdmin, updateTheaterApprovalForAdmin } from "../../../redux/actions/adminAction";
;
import { ApprovalResponse, ApprovalStatus, ResponseStatus, Role } from "../../../interface/Interface";
import { isErrorResponse } from "../../../utils/customError";
import { TheaterDetails } from "../../../component/admin/TheaterDetail";
import Toast2 from "../../../component/Toast2";
import { ToastMessage } from "./AdminUsers";
import ConfirmationModal from "../../../component/ConfirmationModal";

import { ITheaterOwnerEntity } from "../../../interface/theater/ITheaterOwner";

import Pagination from "../../../component/Pagination";
import { getSerialNumber } from "../../../utils/format";

const AdminTheaters: React.FC = (): JSX.Element => {
  const [theaters, setTheaters] = useState<Partial<ITheaterOwnerEntity>[] | []>([]);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
  const [selectedTheater, setSelectedTheater] = useState<{ _id: string, status: boolean | string } | null>(null);

  const setModalClose = () => setIsConfirmModalOpen(false)
  const clearToast = () => setToastMessage(null)
  const dispatch = useDispatch<AppDispatch>();

  const [maxPage, setMaxPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleChangePage = (newPage: number) => setCurrentPage(newPage)
  const [loading, setLoading] = useState(false)
  const fetchTheaters = async () => {
    setLoading(true)
    try {
      const response = await dispatch(getEntityDataForAdmin({ role: Role.theaters, pageNumber: currentPage })).unwrap();

      if (response.status === ResponseStatus.SUCCESS && response.data[Role.theaters]) {
        setTheaters(response.data.theaters?.data)

        setMaxPage(response.data.theaters?.maxPage);
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.error(error);
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTheaters()
  }, [currentPage])

  const BlockButtonClicked = (e: (MouseEvent<HTMLButtonElement> | ChangeEvent<HTMLSelectElement>), _id: string, status: boolean) => {
    e.preventDefault();

    let newStatus: boolean | string

    e.type === 'change' ?
      newStatus = e.currentTarget.value
      : newStatus = status

    setSelectedTheater({ _id, status: newStatus });

    setIsConfirmModalOpen(true);

  }

  const handleBlock = async () => {

    if (selectedTheater) {
      try {
        const response = await dispatch(manageEntitiesByAdmin({ _id: selectedTheater._id, role: 'theaters' })).unwrap();

        if (response.status === ResponseStatus.SUCCESS) {
          const updateDocumentId = response.data as { _id: string };
          if (updateDocumentId) {
            setTheaters((prevData) => {
              return prevData.map((theater) => {
                if (theater._id === updateDocumentId._id) {
                  return { ...theater, status: !theater.status }
                } else {
                  return theater
                }
              })
            })

            setToastMessage({ alert: ResponseStatus.SUCCESS, message: response.message })
          }
        }

      } catch (error) {
        if (isErrorResponse(error)) {
          console.error(error);
          setToastMessage({ alert: ResponseStatus.ERROR, message: error.message })
        }
      } finally {
        setIsConfirmModalOpen(false)
      }
    }
  }

  const handleStatusChange = async () => {

    try {
      if (selectedTheater) {
        const { _id, status: approval_status } = selectedTheater as { _id: string, status: ApprovalStatus };

        const response = await dispatch(updateTheaterApprovalForAdmin({ _id, approval_status })).unwrap();

        if (response.status === ResponseStatus.SUCCESS) {
          const theaterData = response.data?.theater as ApprovalResponse
          if (theaterData) {
            setTheaters((prevData) => {
              return prevData.map((theater) => {
                if (theater._id === theaterData._id) {
                  return { ...theater, approval_status: theaterData.approval_status as ApprovalStatus, };
                } else {
                  return theater;
                }
              });
            });

            setToastMessage({ alert: ResponseStatus.SUCCESS, message: response.message })
          }
        }
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.log(error)
      }
    } finally {
      setSelectedTheater(null)
      setIsConfirmModalOpen(false)

    }

  }

  return (
    <>

      {
        toastMessage &&
        <Toast2
          alert={toastMessage.alert}
          clearToast={clearToast}
          message={toastMessage.message}
        />
      }

      {
        theaters.length > 0 &&
        (
          <div className="mt-8 overflow-x-auto overflow-y-hidden">

            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-left text-black capitalize font-bold">Name</th>
                  <th className=" text-left text-black capitalize font-bold min-w-52">email</th>
                  {/* <th className=" text-left text-black capitalize font-bold min-w-52">status</th> */}
                  <th className=" text-left text-black capitalize font-bold">action</th>
                  <th></th>

                </tr>
              </thead>
              <tbody className=" ">

                {theaters?.length > 0 && theaters.map((theater, index) => (
                  <tr key={theater._id}>
                    <td>{getSerialNumber(currentPage, index)}</td>
                    <td>
                      <div className="flex items-center gap-3   max-w-60  whitespace-nowrap overflow-hidden ">
                        <div>
                          <div className="max-w-60 font-semibold text-black capitalize  text-ellipsis  whitespace-nowrap overflow-hidden"> {theater.name} </div>
                        </div>
                      </div>
                    </td>
                    <td ><span className="badge rounded-none font-bold   min-w-28 overflow-hidden overflow-ellipsis">{theater.email}</span></td>
                    <td className=" text-left text-black">

                      {theater.approval_status === ApprovalStatus.PENDING ?
                        (
                          <select
                            name="approval-status"
                            id="approval-status"
                            value={theater.approval_status}
                            onChange={(e) => BlockButtonClicked(e, theater._id!, true)}
                            data-id={theater._id}
                            className="mt-1.5 w-32 focus:outline-none border-2   rounded-none p-1 capitalize border-gray-300 text-gray-700 sm:text-sm"
                          >
                            <option className='' value={ApprovalStatus.APPROVED}>{ApprovalStatus.APPROVED}</option>
                            <option className='' value={ApprovalStatus.REJECTED}>{ApprovalStatus.REJECTED}</option>
                            <option className='' value={ApprovalStatus.PENDING}>{ApprovalStatus.PENDING}</option>

                          </select>) :
                        (
                          theater.approval_status === ApprovalStatus.APPROVED ?
                            (<button
                              onClick={(e) => BlockButtonClicked(e, theater._id!, theater.status!)}
                              data-id={theater._id}
                              className={
                                `w-32 bg-transparent
                          ${!theater.status ? 'hover:bg-green-500 text-green-700  border-green-500 hover:border-transparent hover:text-white' : 'hover:bg-red-500 text-red-700  border-red-500 hover:border-transparent hover:text-white'} 
                          font-semibold  py-2 px-4 border rounded`}>
                              {!theater.status ? "unblock" : "block"}
                            </button>) :
                            (
                              <button type="button" className="bg-red-500 hover:cursor-no-drop text-white w-32 font-semibold py-2 px-4  capitalize rounded-sm">
                                {theater.approval_status}
                              </button>
                            )
                        )}
                    </td>
                    <td>
                      <TheaterDetails
                        owner={theater}
                      />
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {isConfirmModalOpen && <ConfirmationModal
              isOpen={isConfirmModalOpen}
              onClose={setModalClose}
              onConfirm={typeof selectedTheater?.status === 'boolean' ? handleBlock : handleStatusChange}
              message="Do you want to proceed with this action "
              btnType={selectedTheater?.status ? ResponseStatus.SUCCESS : ResponseStatus.ERROR}
            />}

          </div >
        )

      }

      {
        maxPage && theaters.length > 0 &&
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


export default AdminTheaters