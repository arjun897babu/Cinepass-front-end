import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react"
import { FaArrowLeft, FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { useForm } from "../../../hooks/UseForm"
import { ITheaterScreen, Role } from "../../../interface/Interface"
import { useLoggedOwner } from "../../../hooks/useLoggedUser"
import { useFormSubmit } from "../../../hooks/UseFormSubmitt"
import { createTheaterScreen, getScreen } from "../../../redux/actions/theaterAction"
import { ISeat, ITheaterScreenResponse } from "../../../interface/theater/ITheaterScreen"
import { isReponseError } from "../../../utils/customError"
import { IoIosInformationCircleOutline } from "react-icons/io"

const SeatRow: React.FC<{ rowNumber: number; columnCount: number }> = ({ rowNumber, columnCount }) => {
  const seats = Array.from({ length: columnCount }, (_, col) => (
    <div
      key={`${rowNumber}-${col + 1}`}
      className="seat border border-blue-300 rounded-md w-7 h-7 m-0.5"
    >
      
    </div>

  ));

  return (
    <div key={rowNumber} className="relative flex  items-center">
      <div className="absolute -left-7 font-light text-xs text-black flex items-center justify-center">
        {String.fromCharCode(64 + rowNumber)}
      </div>
      {seats}
    </div>
  );
};

const ColumnNumbers: React.FC<{ columnCount: number }> = ({ columnCount }) => {
  const columns = Array.from({ length: columnCount }, (_, col) => (
    <div
      key={`column-${col + 1}`}
      className="w-7 h-7 m-0.5 flex   justify-center font-light text-xs text-black"
    >
      {col + 1}
    </div>
  ));

  return (
    <div className="relative -bottom-2 flex   items-center mb-1">
      {columns}
    </div>
  );
};

const SeatLayoutModal: React.FC<{ rows: string, column: string, id: string, action: boolean, closeModal: () => void, name: string }> = ({ rows, column, id, action, name, closeModal }) => {

  const rowCount = parseInt(rows, 10);
  const columnCount = parseInt(column, 10);
  const layoutModalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (layoutModalRef.current) {
      layoutModalRef.current.showModal();
    }
  }, []);

  const closeLayoutModal = (e: MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();
    layoutModalRef.current?.close()
    closeModal()
  }

  return (
    <>

      <dialog ref={layoutModalRef} id={`${id}_seat_layout`} className="modal overflow-x-visible ">
        <div className="relative modal-box max-w-max">

          <button onClick={closeLayoutModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <h3 className="text-xl text-center uppercase">screen layout <span className="font-bold text-2xl">{name}</span>  </h3>
          <div className="p-3 relative  ">
            {Array.from({ length: rowCount }, (_, row) => (
              <SeatRow key={row + 1} rowNumber={row + 1} columnCount={columnCount} />
            ))}
            <ColumnNumbers columnCount={columnCount} />
          </div>
        </div>
      </dialog>
    </>
  )
}

const TheaterScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [addForm, setAddForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const [screens, setScreens] = useState<ITheaterScreenResponse[] | []>([]);
  const [selectedScreen, setSelectedScreen] = useState<ITheaterScreenResponse | null>(null)
  const [showmodal, setShowmodal] = useState<boolean>(false);

  const closeViewModal = () => {
    setSelectedScreen(null)
  }
  const closeModal = () => {
    setShowmodal(false)
  }

  const setLayoutView = (e: MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();
    const _id = e.currentTarget.getAttribute('data-id');
    if (_id) {
      const [screen] = screens.filter(screen => screen._id === _id);
      setSelectedScreen(screen);
    }
  }
  const { error } = useLoggedOwner(Role.theaters);

  const fetchScreen = async () => {

    try {
      const response = await dispatch(getScreen()).unwrap()
      if (response) {
        setScreens(response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchScreen()
  }, [])
  const setActionModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (parseInt(formData.column, 10) > 0 && parseInt(formData.rows, 10) > 0)
      setShowmodal(true)
  }
  const initialStat = {
    screen_name: '',
    rows: '',
    column: '',
    amenity: '',
    chargePerSeat: '',
    seating_capacity: '',
  }
  const { formData, handleChange, inputError, setFormData, setInputError } = useForm(initialStat, Role.theaters)

  //showing the add screen form
  const showAddForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, ...initialStat }))
    setInputError({})
    setAddForm((pre) => !pre)
  }

  //showing update form
  const showUpdateForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, ...initialStat }))
    setInputError({})
    const input = document.querySelectorAll('#updateForm input');
    if (input) {
      input.forEach((inputField) => inputField.classList.remove('cursor-not-allowed'))
    }
    setUpdateForm((pre) => !pre)
  }

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  // handling update form submission
  const updateFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = handleSubmit(e);

    try {
      if (isValid) {

      }
      setUpdateForm(false)

    } catch (error) {
      console.log(error)
    }
  }

  const handleAddScreen = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = handleSubmit(e)
    try {
      if (isValid) {

        const screenLayout: Array<Array<ISeat>> = [];

        for (let i = 1; i <= parseInt(formData.rows); i++) {
          const row: ISeat[] = [];
          const rowName = String.fromCharCode(64 + i);
          for (let j = 1; j <= parseInt(formData.column); j++) {
            const seatName = `${rowName}${j}`;
            const seat = {
              name: seatName,
              booked: false
            }
            row.push(seat);
          }
          screenLayout.push(row);
        }

        const response = await dispatch(createTheaterScreen({ ...formData, layout: screenLayout })).unwrap()
      }
      setUpdateForm(false)
    } catch (error) {

      if (isReponseError(error)) {

        setInputError((prev) => (
          {
            ...prev,
            [error.data.error]: error.data.message
          }
        )
        )
      }
    } finally {

    }
  }


  return (
    <>
      {!addForm ? (<>
        <div
          className="flex justify-end items-center mb-6">
          <button className="btn btn-neutral float-end capitalize" onClick={showAddForm}>Add Screen</button>
        </div>

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
                    </td>
                    <td>
                      <span className="badge font-bold rounded-none ">{screen.seating_capacity}</span>
                    </td>
                    <td className="flex justify-center items-center gap-3">

                      <button className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black"><FaEdit /></button>
                      <button className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button>
                    </td>
                    <td>
                      <button className="btn btn-sm   bg-sky-400" data-id={screen._id} onClick={setLayoutView}  >Seat Layout</button>
                    </td>

                  </tr>
                })
              }
            </tbody>
            {/* foot */}
            <tfoot>

            </tfoot>
          </table>

          {selectedScreen && <SeatLayoutModal action={false} column={`${selectedScreen?.column}`} id={`${selectedScreen?._id}`} rows={`${selectedScreen?.rows}`} closeModal={closeViewModal} name={selectedScreen.screen_name} />}
        </div>
      </>)
        :
        (

          <>
            <button className="flex gap-4 items-center capitalize" onClick={showAddForm}>
              <i><FaArrowLeft /></i>
              back
            </button>
            <div className="flex justify-center ">
              <div className={` ${!addForm ? 'hidden' : ''} rounded-lg mt-9 border  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5`}>
                <div className="mt-4">
                  <form action="flex flex-col gap-1" id="screenForm" onSubmit={handleAddScreen}>
                    <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                      <label className='w-24 text-left text-black capitalize text-sm' htmlFor="screen_name">screen name</label>
                      <div className="relative w-full">
                        <input
                          className="p-2 border rounded-md w-full focus:outline-none text-sm"
                          type="text"
                          name="screen_name"
                          placeholder="screen name"
                          onChange={handleChange}
                          value={formData.screen_name}
                        />
                        {inputError.screen_name && <small className='text-red-600 capitalize absolute left-0 -bottom-4  '>{inputError.screen_name}</small>}
                        {error?.error === 'screen_name' && <small className='text-red-600 capitalize absolute left-0 -bottom-4  '>{error.message}</small>}
                      </div>
                    </div>
                    <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                      <label className='w-24 text-left text-black capitalize text-sm' htmlFor="rows">rows</label>
                      <div className="relative w-full">
                        <input
                          className="p-2 border rounded-md w-full focus:outline-none text-sm"
                          type="number"
                          name="rows"
                          placeholder="rows"
                          onChange={handleChange}
                          value={formData.rows}
                        />
                        {inputError.rows && <small className='text-red-600 capitalize absolute left-0 -bottom-4  '>{inputError.rows}</small>}
                        {error?.error === 'rows' && <small className='text-red-600 capitalize absolute left-0 -bottom-4  '>{error.message}</small>}
                      </div>
                    </div>
                    <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                      <label className='w-24 text-left text-black capitalize text-sm' htmlFor="column">columns</label>
                      <div className="relative w-full">
                        <input
                          className="p-2 border rounded-md w-full focus:outline-none text-sm"
                          type="number"
                          name="column"
                          placeholder="columns"
                          onChange={handleChange}
                          value={formData.column}
                        />
                        {inputError.column && <small className='text-red-600 capitalize absolute left-0 -bottom-4  text-xs'>{inputError.column}</small>}
                        {error?.error === 'column' && <small className='text-red-600 capitalize absolute left-0 -bottom-4  text-xs'>{error.message}</small>}
                      </div>
                    </div>
                    <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center">
                      <label className='w-24 text-left text-black capitalize text-sm' htmlFor="select-amenity">amenity</label>
                      <div className="relative w-full">
                        <select
                          className="p-2 border rounded-md w-5/6 focus:outline-none text-sm"
                          name="amenity"
                          id="select-amenity"
                          onChange={handleChange}
                          value={formData.amenity}
                        >
                          <option value="" disabled>select...</option>
                          <option value="2D">2D</option>
                          <option value="3D">3D</option>
                          <option value="4K">4K</option>
                          <option value="IMAX">IMAX</option>
                        </select>
                        {inputError.amenity && <small className='text-red-600 capitalize absolute left-0 -bottom-4  text-xs'>{inputError.amenity}</small>}
                        {error?.error === 'amenity' && <small className='text-red-600 capitalize absolute left-0 -bottom-4  text-xs'>{error.message}</small>}
                      </div>
                    </div>
                    <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                      <label className='w-24 text-left text-black capitalize text-sm' htmlFor="chargePerSeat">charge per seat</label>
                      <div className="relative w-full">
                        <input
                          className="p-2 border rounded-md w-full focus:outline-none text-sm"
                          type="number"
                          name="chargePerSeat"
                          placeholder="charge per seat"
                          onChange={handleChange}
                          value={formData.chargePerSeat}
                        />
                        {inputError.chargePerSeat && <small className='text-red-600 capitalize absolute left-0 -bottom-4  text-xs'>{inputError.chargePerSeat}</small>}
                        {error?.error === 'chargePerSeat' && <small className='text-red-600 capitalize absolute left-0 -bottom-4  text-xs'>{error.message}</small>}
                      </div>
                    </div>
                    <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                      <label className='w-24 text-left text-black capitalize text-sm' htmlFor="seating_capacity">seating capacity</label>
                      <div className="relative w-full">
                        <input
                          className="p-2 border rounded-md w-full focus:outline-none text-sm"
                          type="number"
                          name="seating_capacity"
                          placeholder="seating capacity"
                          onChange={handleChange}
                          value={formData.seating_capacity}
                          readOnly={true}
                        />
                        {inputError.seating_capacity && <small className='text-red-600 capitalize absolute left-0 -bottom-4  text-xs'>{inputError.seating_capacity}</small>}
                        {error?.error === 'seating_capacity' && <small className='text-red-600 capitalize absolute left-0 -bottom-4  text-xs'>{error.message}</small>}
                      </div>
                       
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" className="btn btn-sm  bg-sky-400 hover:bg-sky-500" onClick={setActionModal}>Seat Layout</button>
                    </div>
                    <div className="flex justify-center mt-4">
                      <button className="btn btn-wide bg-sky-400 hover:bg-sky-500 text-white text-sm" type="submit">submit</button>
                    </div>
                  </form>
                </div>
              </div>

              {showmodal && <SeatLayoutModal action={true} rows={formData.rows} column={formData.column} id={'screenForm'} closeModal={closeModal} name={formData.screen_name} />}
            </div>
          </>
        )
      }







      {/* add screen form */}






    </>
  )
}

export default TheaterScreen