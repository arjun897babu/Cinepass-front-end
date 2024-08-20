import { Dispatch, FormEvent, MouseEvent, SetStateAction, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateTheater } from "../../redux/actions/theaterAction";
import { ITheaterOwnerEntity, TheaterProfile } from "../../interface/theater/ITheaterOwner";
import { SubmitHandler, useForm as useForms } from "react-hook-form";
import { TheaterProfileSchema } from "../../utils/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponseStatus } from "../../interface/Interface";
import { Toast } from "../Toast2";
import { isResponseError } from "../../utils/customError";
import ConfirmationModal from "../ConfirmationModal";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import  Autocomplete  from "../Autocomplete";

export interface TheaterProps {
  selectedData: TheaterProfile;
  setTheaterDataResponse: (updatedData: ITheaterOwnerEntity) => void;
  setToast: (toastData: Toast) => void
}



const TheaterUpdateForm: React.FC<TheaterProps> = ({ selectedData, setTheaterDataResponse, setToast }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const [formData, setFormData] = useState<TheaterProfile | null>(null)
  const navigate = useNavigate()
  const closeConfirmation = () => setConfirmation(false)

  const dispatch = useDispatch<AppDispatch>()
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors }
  } = useForms<TheaterProfile>(
    {
      resolver: zodResolver(TheaterProfileSchema),
      defaultValues: selectedData
    }
  )

  const changeCity = (city: string) => {
    setValue('city', city)
  }
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleConfirmation: SubmitHandler<TheaterProfile> = async (data) => {
    setFormData(data);
    setConfirmation(true);
  };

  const onSubmit = async () => {
    if (!formData) return
    try {
      setLoading(true);
      const response = await dispatch(updateTheater(formData)).unwrap();

      const { theater } = response.data
      if (response.status === ResponseStatus.SUCCESS) {
        clearErrors()
        setToast(
          {
            alert: response.status,
            message: response.message
          }
        )
        setTheaterDataResponse(theater)
        setConfirmation(false)
        modalRef.current?.close()
      }
    } catch (error) {

      if (isResponseError(error)) {
        if (error.statusCode == 400) {
          console.log(error)
          setError(
            error.data.error as keyof TheaterProfile,
            {
              message: error.data.message
            }
          )
        } else if (error.statusCode === 403) {
          navigate('/theaters/login', { replace: true, state: { blocked: true } })
        }
        else {
          setToast(
            {
              alert: ResponseStatus.ERROR,
              message: error.data.message
            }
          )
        }


      }
    }
    finally {
      setLoading(false)
      setConfirmation(false)
    }
  };

  const showModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const modal = document.getElementById('theater_details') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  const closeModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const modal = document.getElementById('theater_details') as HTMLDialogElement
    if (modal) {
      modal.close()
    }
    reset()
  }




  return (
    <>

      {
        confirmation &&
        <ConfirmationModal
          message="do you want to update "
          btnType={ResponseStatus.SUCCESS}
          isOpen={confirmation}
          onClose={closeConfirmation}
          onConfirm={onSubmit}
        />
      }

      <button className=" " onClick={showModal}> <FaRegEdit /> </button>
      <dialog ref={modalRef} id="theater_details" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <div className="modal-action mt-0">
            <button onClick={closeModal} className="btn btn-sm btn-circle">✕</button>
          </div>
          <h3 className="font-extrabold capitalize text-2xl text-center mb-2">Update Theater Details</h3>
          <form className="space-y-4" onSubmit={handleSubmit(handleConfirmation)} >
            <div>
              <label className="sr-only" htmlFor="theater_name">Theater Name</label>
              <input
                className="w-full rounded-lg focus:outline-none border p-3 text-sm"
                placeholder="Theater Name"
                type="text"
                id="theater_name"
                {...register('theater_name')}

              />
              {errors.theater_name && <p className="text-red-500 text-xs">{errors.theater_name.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="theater_license">Theater License</label>
                <input
                  className="w-full focus:outline-none rounded-lg border p-3 text-sm"
                  placeholder="Theater License"
                  type="text"
                  id="theater_license"
                  {...register('theater_license')}

                />
                {errors.theater_license && <p className="text-red-500 text-xs">{errors.theater_license.message}</p>}
              </div>

              <div>
                <label className="sr-only" htmlFor="city">City</label>
                {/* <input
                  className="w-full focus:outline-none rounded-lg border p-3 text-sm"
                  placeholder="City"
                  type="text"
                  id="city"
                  {...register('city')}

                /> */}
                <Autocomplete
                  changeCity={changeCity}
                  update={true}
                  value={selectedData.city}
                />

                {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
              </div>
            </div>

            <div>
              <label className="sr-only" htmlFor="address">Address</label>
              <input
                className="w-full rounded-lg focus:outline-none border p-3 text-sm"
                placeholder="Address"
                id="address"
                {...register('address')}

              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>

            {/* <div>
              <ImagePreview setCloudImg={handleImagesToUpload} setCroppedCloudImg={croppedImageToUpload} defaultImg={data.images} />

            </div> */}

            <button className="btn btn-sm float-right" type="submit" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </dialog>

    </>
  );
};

export default TheaterUpdateForm;
