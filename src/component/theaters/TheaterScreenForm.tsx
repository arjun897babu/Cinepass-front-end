import React, { MouseEvent, useEffect, useState } from "react"
import { FaArrowLeft } from "react-icons/fa";
import { Toast } from "../Toast2";
import { ISeat, ITheaterScreen, ITheaterScreenResponse } from "../../interface/theater/ITheaterScreen";
import { SeatLayoutModal } from "./SeatLayoutModal";
import { Controller, SubmitHandler, useForm as useForms } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { theaterScreenSchema } from "../../utils/zodSchema";
import { MovieFormat } from "../../utils/validator";
import { isResponseError } from "../../utils/customError";
import useErrorHandler from "../../hooks/useErrorHandler";
import { Action, ResponseStatus, Role } from "../../interface/Interface";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { createTheaterScreen, updateTheaterScreen } from "../../redux/actions/theaterAction";
import ConfirmationModal from "../ConfirmationModal";
import { getSeatName } from "../../utils/format";
interface ITheaterScreenFormProps {
  setToast: (toast: Toast) => void;
  action: string,
  updateScreenState: (newScreen: ITheaterScreenResponse) => void
  closeForm: () => void
  screenId?: string
  selectedData?: ITheaterScreen
}
const TheaterScreenForm: React.FC<ITheaterScreenFormProps> = (
  {
    action,
    setToast,
    selectedData,
    closeForm,
    screenId,
    updateScreenState
  }
) => {
  const dispatch = useDispatch<AppDispatch>()
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const closeConfirmationModal = () => setConfirmation(false)
  const [showLayoutModal, setShowLayoutModal] = useState<boolean>(false);
  const [addscreenData, setAddScreenData] = useState<ITheaterScreen | null>(null)
  const [updateScreenData, setUpdateScreenData] = useState<ITheaterScreen | null>(null)
  const [seats, setSeats] = useState<ISeat[][]>()
  const handleApiError = useErrorHandler(Role.theaters, setToast)

  const {

    watch,
    control,
    setError,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForms({
    resolver: zodResolver(theaterScreenSchema),
    defaultValues: selectedData ?? {
      screen_name: '',
      rows: '',
      column: '',
      amenity: '',
      chargePerSeat: '',
      seating_capacity: '0',
    }
  })

  const handleFormSubmit: SubmitHandler<ITheaterScreen> = (data) => {
    setConfirmation(true)
    action === Action.ADD ?
      setAddScreenData(data)
      : setUpdateScreenData(data)
  }

  const addScreenSubmit = () => {
    addscreenData ? onSubmit(addscreenData) : null

  }
  const updateScreenSubmit = () => {
    updateScreenData ? onSubmit(updateScreenData) : null
  }

  const onSubmit = async (screenData: ITheaterScreen) => {
    try {

      let response
      if (action === Action.ADD && seats) {
        response = await dispatch(createTheaterScreen({ ...screenData, layout: seats })).unwrap()
      } else if (action === Action.UPDATE && seats && screenId) {
        response = await dispatch(updateTheaterScreen({ screenId: screenId, payload: { ...screenData, layout: seats } })).unwrap()
      }

      if (response?.status === ResponseStatus.SUCCESS) {
        setToast({
          alert: response.status,
          message: response.message
        })
        updateScreenState(response.data.screen)
        closeForm();
      }
    } catch (error) {
      if (isResponseError(error)) {

        if (error.statusCode === 400 || error.statusCode == 409) {
          setError(error.data.error as keyof ITheaterScreen, { message: error.data.message })
        }
      } else {
        handleApiError(error)
      }

    } finally {
      setConfirmation(false)
    }
  }

  let rows = watch("rows");
  let column = watch("column");
  let screen_name = watch("screen_name")
  let seating_capacity = watch("seating_capacity")


  const closeScreenForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    closeForm()
  }

  const showLayot = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (parseInt(rows, 10) > 0 && parseInt(column, 10) > 0) {
      setShowLayoutModal(true)
    }
  }
  const handleChange = () => {
    const numRows = parseInt(rows, 10) || 0;
    const numColumns = parseInt(column, 10) || 0;
    const capacity = numRows * numColumns;
    setValue('seating_capacity', capacity.toString());

    const initialSeats = Array.from({ length: numRows }, (_, rowIndex) =>
      Array.from({ length: numColumns }, (_, colIndex) => ({
        name: getSeatName(rowIndex,colIndex),
        available: true,
      }))
    );

    setSeats(initialSeats);
  };

  useEffect(() => {
    handleChange();
  }, [rows, column]);

  useEffect(() => {
    if (selectedData?.layout) {
      setSeats(selectedData.layout)
      setValue('seating_capacity', selectedData.seating_capacity)
    }
  }, []);


  const handleSeatClick = (rowIndex: number, colIndex: number) => {
    if (seats) {
      const newSeats = seats.map((row, rIndex) =>
        row.map((seat, cIndex) => {
          if (rIndex === rowIndex && cIndex === colIndex) {
            const isAvailable = !seat.available;
            const preCapacity = parseInt(seating_capacity, 10) | 0
            const newCapacity = isAvailable ? (preCapacity + 1).toString() : (preCapacity - 1).toString()
            setValue('seating_capacity', newCapacity)
            return { ...seat, available: isAvailable };
          }
          return seat
        })
      );
      setSeats(newSeats);
    }
  }

  return (

    <>

      {
        confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.SUCCESS}
          isOpen={confirmation}
          message={`Are your sure want to ${action} this screen`}
          onClose={closeConfirmationModal}
          onConfirm={action === Action.ADD ? addScreenSubmit : updateScreenSubmit}
        />
      }

      <button className="flex gap-4 items-center capitalize" onClick={closeScreenForm}>
        <i><FaArrowLeft /></i>
        back
      </button>
      <div className="flex justify-center ">

        <div className={` shadow rounded-lg mt-9 border  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5`}>
          <div className="mt-4">
            <form className=" flex flex-col gap-1" id="screenForm" onSubmit={handleSubmit(handleFormSubmit)}>
              <h1 className="text-center uppercase bg-sky-400 font-semibold"> {action} screen</h1>
              <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                <label className='w-24 text-left text-black capitalize text-sm' htmlFor="screen_name">screen name</label>
                <div className="relative w-full mb-2">
                  <Controller
                    name="screen_name"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="input input-bordered"
                        type="text"
                        {...field}
                        placeholder="screen name"
                      />
                    )}
                  />
                  {errors.screen_name && <small className='text-red-600 capitalize absolute left-3 -bottom-5 font-serif  '>{errors.screen_name.message}</small>}

                </div>
              </div>
              <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                <label className='w-24 text-left text-black capitalize text-sm' htmlFor="rows">rows</label>
                <div className="relative w-full mb-2">
                  <Controller
                    name="rows"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="input input-bordered"
                        type="text"
                        {...field}

                        placeholder="rows"
                      />
                    )}
                  />
                  {errors.rows && <small className='text-red-600 capitalize absolute left-3 -bottom-5 font-serif  '>{errors.rows.message}</small>}

                </div>
              </div>
              <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                <label className='w-24 text-left text-black capitalize text-sm' htmlFor="column">columns</label>
                <div className="relative w-full mb-2">
                  <Controller
                    name="column"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="input input-bordered"
                        type="text"
                        {...field}
                        placeholder="column"
                      />
                    )}
                  />

                  {errors.column && <small className='text-red-600 capitalize absolute left-3 -bottom-5 font-serif  text-xs'>{errors.column.message}</small>}

                </div>
              </div>
              <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center">
                <label className='w-24 text-left text-black capitalize text-sm' htmlFor="select-amenity">amenity</label>
                <div className="relative w-full mb-2">
                  <select
                    className="select"
                    {...register("amenity")}
                  >
                    <option value="" >select...</option>
                    {Object.values(MovieFormat).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                  {errors.amenity && <small className='text-red-600 capitalize absolute left-3 -bottom-5 font-serif  text-xs'>{errors.amenity.message}</small>}

                </div>
              </div>
              <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                <label className='w-24 text-left text-black capitalize text-sm' htmlFor="chargePerSeat">charge per seat</label>
                <div className="relative w-full mb-2">
                  <Controller
                    name="chargePerSeat"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="input input-bordered"
                        type="text"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                        }}
                        placeholder="charge per seat"
                      />
                    )}
                  />
                  {errors.chargePerSeat && <small className='text-red-600 capitalize absolute left-3 -bottom-5 font-serif  text-xs'>{errors.chargePerSeat.message}</small>}

                </div>
              </div>
              <div className="p-2 mt-1 gap-3 w-full relative flex justify-center items-center text-center">
                <label className='w-24 text-left text-black capitalize text-sm' htmlFor="seating_capacity">seating capacity</label>
                <div className="relative w-full mb-2">
                  <Controller
                    name="seating_capacity"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="input input-bordered"
                        type="text"
                        {...field}
                        placeholder="seating_capacity"
                        readOnly={true}
                      />
                    )}
                  />
                  {errors.seating_capacity && <small className='text-red-600 capitalize absolute left-3 -bottom-5 font-serif  text-xs'>{errors.seating_capacity.message}</small>}

                </div>

              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-sm  bg-sky-400 hover:bg-sky-500" onClick={showLayot}>Seat Layout</button>
              </div>
              <div className="flex justify-center mt-4">
                <button className="btn btn-wide bg-sky-400 hover:bg-sky-500 text-white text-sm" type="submit">submit</button>
              </div>
            </form>
          </div>
        </div>

        {
          showLayoutModal
          &&
          <SeatLayoutModal
            action={true}
            rows={rows}
            column={column}
            id={'screenForm'}
            seats={seats}
            closeModal={() => setShowLayoutModal(false)}
            name={screen_name}
            handleSeatClick={handleSeatClick}
          />
        }
      </div>
    </>


  )
}


export default TheaterScreenForm