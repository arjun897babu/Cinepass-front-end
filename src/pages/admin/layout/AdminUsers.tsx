import { lazy, MouseEvent, useEffect, useState } from "react";
import { IUser } from "../../../interface/user/IUserData";
// import { EmptyData } from "../../../component/EmptyData";
const EmptyData = lazy(() => import('../../../component/EmptyData'))
import { getEntityDataForAdmin, manageEntitiesByAdmin } from "../../../redux/actions/adminAction";
import { ResponseStatus, Role } from "../../../interface/Interface";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { isErrorResponse } from "../../../utils/customError";
// import { Loader } from "../../../component/Loader";
import { useLoggedOwner } from "../../../hooks/useLoggedUser";


const AdminUsers: React.FC = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [users, setUsers] = useState<IUser[] | []>([]);
  const { loading } = useLoggedOwner(Role.admin)
  
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
  const handleBlock = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const _id = e.currentTarget.getAttribute('data-id')
    console.log(_id)
    if (_id) {
      try {
        const response = await dispatch(manageEntitiesByAdmin({ _id, role: Role.users })).unwrap();
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
          }
        }

      } catch (error) {
        if (isErrorResponse(error)) {
          console.error(error);
        }
      }
    }
  }

  // if (loading) return <>< Loader /></>


  return (
    <>
      {
        users?.length > 0 &&
        (
          <div className="overflow-x-auto">

            <table className="w-full sm:max-w-full rounded-lg border border-gray-200 border-spacing-9 divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>

                  <th className="px-4 py-2 text-left text-black capitalize font-sans">Name</th>
                  <th className="px-4 py-2  text-left text-black capitalize font-sans min-w-52">email</th>
                  {/* <th className="px-4 py-2  text-left text-black capitalize font-sans min-w-52">status</th> */}
                  <th className="px-4 py-2  text-left text-black capitalize font-sans">action</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">

                {users?.length > 0 && users.map((value) => (
                  <tr key={value._id}>
                    <td className="px-4 capitalize py-2 text-left text-black min-w-28 whitespace-nowrap overflow-hidden overflow-ellipsis">{value.name}</td>
                    <td className="px-4 py-2 text-left text-black min-w-28 overflow-hidden overflow-ellipsis">{value.email}</td>
                    {/* <td className="px-4 py-2 text-left text-black">{value.mobile_number}</td> */}
                    <td className="px-4 py-2 text-left text-black">

                      <button
                        onClick={handleBlock}
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
          </div >
        )


      }


    </>
  )
};

export default AdminUsers