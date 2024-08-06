import { FormEvent, MouseEvent, useState } from "react"
import { FaArrowLeft, FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { useForm } from "../../../hooks/UseForm"
import { Role } from "../../../interface/Interface"
import { useLoggedOwner } from "../../../hooks/useLoggedUser"
import { useFormSubmit } from "../../../hooks/UseFormSubmitt"
import { createTheaterScreen } from "../../../redux/actions/theaterAction"
import { ISeat } from "../../../interface/theater/ITheaterScreen"

const SeatRow: React.FC<{ rowNumber: number; columnCount: number }> = ({ rowNumber, columnCount }) => {
  const seats = Array.from({ length: columnCount }, (_, col) => (
    <div
      key={`${rowNumber}-${col + 1}`}
      className="seat border border-blue-300 rounded-md w-7 h-7 m-0.5 flex items-center justify-center"
    >
      {/* {`${String.fromCharCode(64 + rowNumber)}${col + 1}`} */}
    </div>

  ));

  return (
    <div key={rowNumber} className="relative flex justify-center items-center">
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
      className="w-7 h-7 m-0.5 flex items-center justify-center font-light text-xs text-black"
    >
      {col + 1}
    </div>
  ));

  return (
    <div className="relative -bottom-2 flex justify-center items-center mb-1">
      {columns}
    </div>
  );
};

const SeatLayoutModal: React.FC<{ rows: string, column: string, id: string }> = ({ rows, column, id }) => {

  const rowCount = parseInt(rows, 10);
  const columnCount = parseInt(column, 10);

  const showModal = (e: MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();
    e.stopPropagation();
    const modal = document.getElementById(`${id}_seat_layout`) as HTMLDialogElement
    if (modal && rowCount > 0 && columnCount > 0) {
      modal.showModal()
    }
  }

  const closeModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const modal = document.getElementById(`${id}_seat_layout`) as HTMLDialogElement
    if (modal) {
      modal.close()
    }
  }

  return (
    <>
      <button className="btn btn-sm  bg-sky-400 " onClick={showModal}>seat layout</button>
      <dialog id={`${id}_seat_layout`} className="modal">
        <div className="relative modal-box w-11/12 max-w-5xl">

          <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <h3 className="font-bold text-2xl text-center uppercase">screen layout </h3>
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

  const [addForm, setAddForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useLoggedOwner(Role.theaters);

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
        const screenLayout = [];
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

        const response = await dispatch(createTheaterScreen({ ...formData, layout: screenLayout }))

        console.log(response)
      }
      setUpdateForm(false)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      {!addForm ? (<>
        <div className="join mb-7">
          <button className="btn join-item capitalize mr-5 ">screen 1</button>
          <button className="btn join-item capitalize mr-5 ">screen 2</button>
          <button className="btn  join-item capitalize mr-5 ">screen 3</button>
        </div>
        <button className="btn btn-neutral float-end capitalize" onClick={showAddForm}>Add Screen</button>
      </>)
        :
        (
          <button className="flex gap-4 items-center capitalize" onClick={showAddForm}>
            <i><FaArrowLeft /></i>
            back
          </button>
        )
      }


      <div className="w-full flex justify-center items-center mx-auto">

        <div className="relative w-full">
          <div className={`card ${addForm ? 'hidden' : ''} border-2 rounded-none border-sky-100`}>
            <div className="card-body">
              {/* Header Section */}
              <h2 className="card-title  justify-center border-b-4 pb-2 uppercase ">Screen details</h2>
              <div className="bg-sky-400">
                <div className={`${!updateForm ? 'justify-between' : 'justify-center'} flex  items-center p-2`}>
                  <div className="bg-black text-white px-3 rounded">
                    <h2 className="text-xl">AUDI 1</h2>
                  </div>
                  {!updateForm && <div className="join join-horizontal">
                    <button onClick={showUpdateForm} className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black"><FaEdit /></button>
                    <button className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button>
                  </div>}
                </div>
              </div>
              {/* Header Section */}
              {/* Screen Details Section */}
              <div className="mt-4">
                {/* update screen form */}
                <form action="flex flex-col w-full gap-1" id="updateForm" onSubmit={updateFormSubmit}>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="screen_name">screen name</label>
                    <div className="relative w-full">
                      <input
                        readOnly={!updateForm}
                        className="p-2 border cursor-not-allowed text-gray-400 rounded-md w-full focus:outline-none"
                        type="text"
                        name="screen_name"
                        placeholder="screen name"
                        value={formData.screen_name}
                        onChange={handleChange}

                      />
                      {inputError.screen_name && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.screen_name}</small>}
                      {error?.error === 'screen_name' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="rows">rows</label>
                    <div className="relative w-full">
                      <input
                        readOnly={!updateForm}
                        className="p-2 border cursor-not-allowed text-gray-400 rounded-md w-full focus:outline-none"
                        type="text"
                        name="rows"
                        placeholder="rows"
                        onChange={handleChange}
                        value={formData.rows}
                      />
                      {inputError.rows && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.rows}</small>}
                      {error?.error === 'rows' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="column">columns</label>
                    <div className="relative w-full">
                      <input
                        readOnly={!updateForm}
                        className="p-2 border cursor-not-allowed text-gray-400 rounded-md w-full focus:outline-none"
                        type="text"
                        name="column"
                        placeholder="columns"
                        onChange={handleChange}
                        value={formData.column}

                      />
                      {inputError.column && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.column}</small>}
                      {error?.error === 'column' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="chargePerSeat">charge per seat</label>
                    <div className="relative w-full">
                      <input
                        readOnly={!updateForm}
                        className="p-2 border cursor-not-allowed text-gray-400 rounded-md w-full focus:outline-none"
                        type="text"
                        name="chargePerSeat"
                        placeholder="charge per seat"
                        onChange={handleChange}
                        value={formData.chargePerSeat}
                      />
                      {inputError.chargePerSeat && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.chargePerSeat}</small>}
                      {error?.error === 'chargePerSeat' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="seating_capacity">seating capacity</label>
                    <div className="relative w-full">
                      <input
                        readOnly={true}
                        className="p-2 border cursor-not-allowed text-gray-400 rounded-md w-full focus:outline-none"
                        type="text"
                        name="seating_capacity"
                        placeholder="seating capacity"


                        value={formData.seating_capacity}
                      />
                      {inputError.seating_capacity && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.seating_capacity}</small>}
                      {error?.error === 'seating_capacity' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                    <SeatLayoutModal rows={formData.rows} column={formData.column} id="updateForm" />
                  </div>
                  {updateForm && <div className="flex justify-center mt-4">
                    <button className="btn btn-wide bg-sky-400 hover:bg-sky-500 text-white" type="submit">Update</button>
                  </div>}
                </form>
                {/* update screen form */}

              </div>
            </div>
          </div>

          {/* add screen form */}
          <div className={`card ${!addForm ? 'hidden' : ''}  rounded-sm  mt-2 border border-gray-200`}>
            <div className="card-body">

              <h2 className="card-title justify-center border-b-4  pb-2 uppercase ">Add screen</h2>

              {/* Screen Details Section */}
              <div className="mt-4">
                <form action="flex flex-col gap-1" id="screenForm" onSubmit={handleAddScreen}>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="screen_name">screen name</label>
                    <div className="relative w-full">
                      <input
                        className="p-2 border  text-gray-400 rounded-md w-full focus:outline-none"
                        type="text"
                        name="screen_name"
                        placeholder="screen name"
                        onChange={handleChange}
                        value={formData.screen_name}

                      />
                      {inputError.screen_name && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.screen_name}</small>}
                      {error?.error === 'screen_name' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="rows">rows</label>
                    <div className="relative w-full">
                      <input
                        className="p-2 border  text-gray-400 rounded-md w-full focus:outline-none"
                        type="number"
                        name="rows"
                        placeholder="rows"
                        onChange={handleChange}
                        value={formData.rows}
                      />
                      {inputError.rows && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.rows}</small>}
                      {error?.error === 'rows' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="column">columns</label>
                    <div className="relative w-full">
                      <input
                        className="p-2 border  text-gray-400 rounded-md w-full focus:outline-none"
                        type="number"
                        name="column"
                        placeholder="columns"
                        onChange={handleChange}
                        value={formData.column}
                      />
                      {inputError.column && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.column}</small>}
                      {error?.error === 'column' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center ">
                    <label className='w-24 text-left text-black capitalize' htmlFor="select-amenity">amenity</label>
                    <div className="relative w-full">
                      <select
                        className="p-2 border select text-gray-400 rounded-md w-1/2 focus:outline-none"
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
                      {inputError.amenity && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.amenity}</small>}
                      {error?.error === 'amenity' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="chargePerSeat">charge per seat</label>
                    <div className="relative w-full">
                      <input
                        className="p-2 border  text-gray-400 rounded-md w-full focus:outline-none"
                        type="number"
                        name="chargePerSeat"
                        placeholder="charge per seat"
                        onChange={handleChange}
                        value={formData.chargePerSeat}
                      />
                      {inputError.chargePerSeat && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.chargePerSeat}</small>}
                      {error?.error === 'chargePerSeat' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                  </div>
                  <div className="p-2 mt-1  gap-3 w-full relative flex justify-center items-center text-center">
                    <label className='w-24 text-left text-black capitalize' htmlFor="seating_capacity">seating capacity</label>
                    <div className="relative w-full">
                      <input
                        className="p-2 border  text-gray-400 rounded-md w-full focus:outline-none"
                        type="number"
                        name="seating_capacity"
                        placeholder="seating capacity"
                        onChange={handleChange}
                        value={formData.seating_capacity}
                        readOnly={true}
                      />
                      {inputError.seating_capacity && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.seating_capacity}</small>}
                      {error?.error === 'seating_capacity' && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{error.message}</small>}
                    </div>
                    <SeatLayoutModal rows={formData.rows} column={formData.column} id={'screenForm'} />
                  </div>
                  <div className="flex justify-center mt-4">
                    <button className="btn btn-wide bg-sky-400 hover:bg-sky-500 text-white" type="submit">submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div >
    </>
  )
}

export default TheaterScreen