import {  MouseEvent, useEffect , useState } from "react";
import { IUser } from "../../../interface/user/IUserData";
// import { EmptyData } from "../../../component/EmptyData";
// const EmptyData = lazy(() => import('../../../component/EmptyData'))
import { getEntityDataForAdmin, manageEntitiesByAdmin } from "../../../redux/actions/adminAction";
import { ResponseStatus, Role } from "../../../interface/Interface";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { isErrorResponse } from "../../../utils/customError";
// import { Loader } from "../../../component/Loader";
 
import ConfirmationModal from "../../../component/ConfirmationModal";
import Toast2 from "../../../component/Toast2";

export type ToastMessage = {
  alert: ResponseStatus,
  message: string
}

const AdminUsers: React.FC = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [users, setUsers] = useState<IUser[] | []>([]);
  

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
  const setModalClose = () => setIsConfirmModalOpen(false)
  const [selectedUser, setSelectedUser] = useState<{ _id: string, status: boolean } | null>(null);


  const fetchUsers = async () => {
    try {
      const response = await dispatch(getEntityDataForAdmin(Role.users)).unwrap();
      if (response.status === ResponseStatus.SUCCESS) {
        response.data ? setUsers(response.data.users as unknown as IUser[]) : setUsers([])

      }
    } catch (error) {
      if (isErrorResponse(error)) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const clearToast = () => setToastMessage(null)

  const BlockButtonClicked = (e: MouseEvent<HTMLButtonElement>, _id: string, status: boolean) => {
    e.preventDefault();
    setSelectedUser({ _id, status });
    setIsConfirmModalOpen(true);

  }

  const handleBlock = async () => {


    if (selectedUser) {
      try {
        const response = await dispatch(manageEntitiesByAdmin({ _id: selectedUser._id, role: Role.users })).unwrap();
        if (response.status === ResponseStatus.SUCCESS) {
          const updateDocumentId = response.data as { _id: string };
          if (updateDocumentId) {
            setUsers((prevData) => {
              return prevData.map((user) => {
                if (user._id === updateDocumentId._id) {
                  return { ...user, status: !user.status }
                } else {
                  return user
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
      }
      finally {
        setSelectedUser(null);
        setIsConfirmModalOpen(false)
      }
    }
  }

  // if (loading) return <>< Loader /></>


  return (
    <>

      {toastMessage && <Toast2 alert={toastMessage.alert} clearToast={clearToast} message={toastMessage.message} />}

      {
        users?.length > 0 &&
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

                </tr>
              </thead>
              <tbody className=" ">

                {users?.length > 0 && users.map((value, index) => (
                  <tr key={value._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3   max-w-60  whitespace-nowrap overflow-hidden ">
                        <div className="avatar">
                          <div className="mask rounded-full h-12 w-12">
                            <img
                              src={value.profile_picture ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'}
                              alt={value.name + ' poster'} />
                          </div>
                        </div>
                        <div>
                          <div className="max-w-60 font-semibold text-black capitalize  text-ellipsis  whitespace-nowrap overflow-hidden"> {value.name} </div>
                          <div className="text-sm opacity-50">{value.location}</div>
                        </div>
                      </div>
                    </td>
                    <td ><span className="badge rounded-none font-bold   min-w-28 overflow-hidden overflow-ellipsis">{value.email}</span></td>
                    <td className=" text-left text-black">

                      <button
                        onClick={(e) => BlockButtonClicked(e, value._id, value.status)}
                        data-id={value._id}
                        className={
                          `w-32 bg-transparent
                  ${!value.status ? 'hover:bg-green-500 text-green-700  border-green-500 hover:border-transparent hover:text-white' : 'hover:bg-red-500 text-red-700  border-red-500 hover:border-transparent hover:text-white'} 
                  font-semibold  py-2 px-4 border rounded`}>
                        {!value.status ? "unblock" : "block"}
                      </button> </td>

                  </tr>
                ))}

              </tbody>

            </table>
            {isConfirmModalOpen && <ConfirmationModal
              isOpen={isConfirmModalOpen}
              onClose={setModalClose}
              onConfirm={handleBlock}
              message="Do you want to proceed with this action "
              btnType={!selectedUser?.status ? ResponseStatus.success : ResponseStatus.ERROR}
            />}
          </div >
        )


      }


    </>
  )
};

export default AdminUsers