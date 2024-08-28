import { MouseEvent, useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../redux/store"
import { Action, ResponseStatus, Role } from "../../../interface/Interface"

import { deleteTheaterScreen, getScreen } from "../../../redux/actions/theaterAction"
import { ISeat, ITheaterScreen, ITheaterScreenResponse } from "../../../interface/theater/ITheaterScreen"
import { isResponseError } from "../../../utils/customError"
import Toast2, { Toast } from "../../../component/Toast2"
import ConfirmationModal from "../../../component/ConfirmationModal"
import useErrorHandler from "../../../hooks/useErrorHandler"
import TheaterScreenForm from "../../../component/theaters/TheaterScreenForm"
import { SeatLayoutModal } from "../../../component/theaters/SeatLayoutModal"

const TheaterScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [screens, setScreens] = useState<ITheaterScreenResponse[] | []>([]);
  const updateScreenState = (newScreen: ITheaterScreenResponse) => {
    setScreens((prev) => {
      const screenExists = prev.some(screen => screen._id === newScreen._id);
  
      if (screenExists) {
        return prev.map(screen =>
          screen._id === newScreen._id ? { ...screen, ...newScreen } : screen
        );
      } else {
        return [...prev, newScreen];
      }
    });
  };
  


  const [addForm, setAddForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<ITheaterScreen | null>(null) // for updation
  const [deleteScreen, setDeleteScreen] = useState<string | null>(null)//for deletion
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null)
  const [layoutModalScreen, setLayoutMoalScreen] = useState<ITheaterScreenResponse | null>(null)//for seat layout

  const closeLayoutModal = () => setLayoutMoalScreen(null)
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmation, setConfirmation] = useState<boolean>(false);

  const updateSelected = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault()
    setSelectedScreenId(id);
    const selected = screens.find((screen) => screen._id === id);
    selected ?
      (setSelectedScreen({
        chargePerSeat: `${selected.chargePerSeat}`,
        column: `${selected.column}`,
        rows: `${selected.rows}`,
        amenity: selected.amenity,
        screen_name: selected.screen_name,
        seating_capacity: `${selected.seating_capacity}`,
        layout: selected.layout
      }), setUpdateForm(true)) : null
  }

  const deleteSelected = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault()
    id ?
      setDeleteScreen(id) : null
    setConfirmation(true)
  }

  const setLayoutView = (e: MouseEvent<HTMLButtonElement>, screen: ITheaterScreenResponse) => {
    e.preventDefault();
    if (screen) {
      setLayoutMoalScreen(screen)
    }
  }

  const fetchScreen = async () => {
    try {
      const response = await dispatch(getScreen()).unwrap()
      if (response) {
        setScreens(response)
      }
    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode == 404) {
          setToast({
            alert: ResponseStatus.ERROR,
            message: error.data.message
          })
        }
      }
    }
  }

  useEffect(() => {
    fetchScreen()
  }, []);



  //showing the add screen form
  const showAddForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAddForm(true)
  }

  const closeAddForm = () => setAddForm(false)
  const closeUpdateForm = () => {
    setUpdateForm(false)
    setSelectedScreenId(null)
  }


  const handleApiError = useErrorHandler(Role.theaters, setToast)

  //for deleting a specifc screen
  const deleteSelectedScreen = async () => {
    try {
      if (deleteScreen) {
        const response = await dispatch(deleteTheaterScreen(deleteScreen)).unwrap()

        if (response.status === ResponseStatus.SUCCESS) {
          setToast({
            alert: response.status,
            message: response.message
          })

          const filtered = screens.filter((screen) => screen._id !== response.data._id)
          setScreens(filtered)
        }
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setConfirmation(false)
    }
  }

  return (

    <>

      {
        toast &&
        <Toast2
          alert={toast.alert}
          clearToast={() => setToast(null)}
          message={toast.message}
        />
      }

      {
        confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.ERROR}
          isOpen={confirmation}
          message="are you sure want to delte this"
          onClose={() => setConfirmation(false)}
          onConfirm={deleteSelectedScreen}
        />
      }


      {
        (!addForm && !updateForm) &&
        <>
          < div
            className="flex justify-end items-center mb-6">
            <button className="btn btn-neutral float-end capitalize" onClick={showAddForm}>Add Screen</button>
          </div >

          <div
            className="overflow-x-auto overflow-y-hidden">
            <table className="table ">
              {/* head */}
              <thead className=" ">
                <tr>
                  <th>
                  </th>
                  <th className="font-bold text-black">Name</th>
                  <th className="font-bold text-black">Seating Capacity</th>
                  <th className="font-bold text-black text-center">Action</th>
                  <th > </th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="  ">
                {
                  screens.length > 0 &&
                  screens.map((screen, index) => {
                    return <tr key={screen._id}>
                      <th>
                        {index + 1}
                      </th>
                      <td>
                        {screen.screen_name}
                        <br />
                        {screen.amenity}
                      </td>
                      <td>
                        <span className="badge font-bold rounded-none ">{screen.seating_capacity}</span>
                      </td>
                      <td className="flex justify-center items-center gap-3">

                        <button onClick={(e) => updateSelected(e, screen._id)} className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black"><FaEdit /></button>
                        <button onClick={(e) => deleteSelected(e, screen._id)} className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button>
                      </td>
                      <td>
                        <button className="btn btn-sm   bg-sky-400" data-id={screen._id} onClick={(e) => setLayoutView(e, screen)}  >Seat Layout</button>
                      </td>

                    </tr>
                  })
                }
              </tbody>
              {/* foot */}
              <tfoot>

              </tfoot>
            </table>

            {
              layoutModalScreen &&
              <SeatLayoutModal
                name={layoutModalScreen.screen_name}
                action={false}
                column={`${layoutModalScreen?.column}`}
                id={`${layoutModalScreen?._id}`}
                rows={`${layoutModalScreen?.rows}`}
                closeModal={closeLayoutModal}
                seats={layoutModalScreen.layout}
              />}
          </div>
        </>


      }

      {
        addForm
        && <TheaterScreenForm
          action={Action.ADD}
          setToast={setToast}
          closeForm={closeAddForm}
          updateScreenState={updateScreenState}
        />
      }

      {
        (updateForm && selectedScreen&&selectedScreenId)
        && <TheaterScreenForm
          action={Action.UPDATE}
          setToast={setToast}
          selectedData={selectedScreen}
          closeForm={closeUpdateForm}
          updateScreenState={updateScreenState}
          screenId={selectedScreenId}
        />
      }

    </>
  )
}

export default TheaterScreen