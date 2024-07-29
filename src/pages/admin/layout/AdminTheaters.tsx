import React, { MouseEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { getEntityDataForAdmin, manageEntitiesByAdmin, updateTheaterApprovalForAdmin } from "../../../redux/actions/adminAction";
import { ITheaterOwnerEntity } from "../../../interface/theater/ITheaterOwner";
import { ApprovalResponse, ApprovalStatus, ResponseStatus, Role } from "../../../interface/Interface";
import { isErrorResponse } from "../../../utils/customError";
import { TheaterDetails } from "../../../component/admin/TheaterDetail";
// import { Loader } from "../../../component/Loader";
// const EmptyData = lazy(() => import('../../../component/EmptyData'))



const AdminTheaters: React.FC = (): JSX.Element => {
  const [theaters, setTheaters] = useState<ITheaterOwnerEntity[] | []>([]);
  const dispatch = useDispatch<AppDispatch>();
  // const { loading } = useLoggedOwner(Role.admin) 
  const fetchTheaters = async () => {
    try {
      const response = await dispatch(getEntityDataForAdmin(Role.theaters)).unwrap();
      if (response.status === ResponseStatus.SUCCESS) {

        response.data ? setTheaters(response.data.theaters as unknown as ITheaterOwnerEntity[]) : setTheaters([])
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchTheaters()
  }, [])






  const handleBlock = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const _id = event.currentTarget.getAttribute('data-id');
    if (_id) {
      try {
        const response = await dispatch(manageEntitiesByAdmin({ _id, role: 'theaters' })).unwrap();
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
          }
        }

      } catch (error) {
        if (isErrorResponse(error)) {
          console.error(error);
        }
      }
    }
  }



  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {

    const theaterOwnerId = e.target.getAttribute('data-id');
    const approval_status = e.target.value
    try {
      if (theaterOwnerId) {
        const response = await dispatch(updateTheaterApprovalForAdmin({ theaterOwnerId, approval_status })).unwrap();
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
          }
        }
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.log(error)
      }
    }

  }

  // if (loading) return <>< Loader /></>

  return (
    <>
      {
        theaters.length > 0 && (<div className="overflow-x-auto">

          <table className="w-full sm:max-w-full rounded-lg border border-gray-200 border-spacing-9 divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>

                <th className="px-4 py-2 text-left text-black capitalize font-sans">owner</th>
                <th className="px-4 py-2  text-left text-black capitalize font-sans min-w-52">theater license number</th>
                {/* <th className="px-4 py-2 text-black capitalize font-sans min-w-48">Approval status</th> */}
                <th className="px-4 py-2  text-left text-black capitalize font-sans">view</th>
                <th className="px-4 py-2  text-left text-black capitalize font-sans">action</th>

              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 ${!theaters.length ? 'h-full' : ''}`}>

              {theaters?.length > 0 && theaters.map((owner) => (
                <tr key={owner._id}>
                  <td className="px-4 capitalize py-2 text-left text-black min-w-28 whitespace-nowrap overflow-hidden overflow-ellipsis">{owner.name}</td>
                  <td className="px-4 py-2 text-left text-black min-w-28 overflow-hidden overflow-ellipsis">{owner.theater_license}</td>
                  {/* <td className="px-4 py-2 text-left text-black">{owner.approval_status}</td> */}
                  <td className="px-2 py-2   text-black">
                    <TheaterDetails owner={owner} />
                  </td>
                  <td className="px-4 py-2 text-left text-black">

                    {owner.approval_status === ApprovalStatus.PENDING ?
                      (
                        <select
                          name="approval-status"
                          id="approval-status"
                          value={owner.approval_status}
                          onChange={handleStatusChange}
                          data-id={owner._id}
                          className="mt-1.5 w-32 focus:outline-none border-2   rounded-none p-1 capitalize border-gray-300 text-gray-700 sm:text-sm"
                        >
                          <option className='' value={ApprovalStatus.APPROVED}>{ApprovalStatus.APPROVED}</option>
                          <option className='' value={ApprovalStatus.REJECTED}>{ApprovalStatus.REJECTED}</option>
                          <option className='' value={ApprovalStatus.PENDING}>{ApprovalStatus.PENDING}</option>

                        </select>) :
                      (
                        owner.approval_status === ApprovalStatus.APPROVED ?
                          (<button
                            onClick={handleBlock}
                            data-id={owner._id}
                            className={
                              `w-32 bg-transparent
                          ${!owner.status ? 'hover:bg-green-500 text-green-700  border-green-500 hover:border-transparent hover:text-white' : 'hover:bg-red-500 text-red-700  border-red-500 hover:border-transparent hover:text-white'} 
                          font-semibold  py-2 px-4 border rounded`}>
                            {!owner.status ? "unblock" : "block"}
                          </button>) :
                          (
                            <button type="button" className="bg-red-500 hover:cursor-no-drop text-white w-32 font-semibold py-2 px-4  capitalize rounded-sm">
                              {owner.approval_status}
                            </button>
                          )
                      )
                    }
                  </td>
                </tr>
              ))}

            </tbody>

          </table>
        </div >)

      }


    </>
  )
}


export default AdminTheaters