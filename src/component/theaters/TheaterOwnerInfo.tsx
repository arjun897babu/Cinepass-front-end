import React, { MouseEvent, useEffect, useState } from "react"
import { TheaterProps } from "./TheaterUpdateForm"
import { ITheaterOwnerEntity, TheaterOwnerProfile } from "../../interface/theater/ITheaterOwner"
import { Toast } from "../Toast2";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TheaterOwnerSchema } from "../../utils/zodSchema";
import { ResponseStatus } from "../../interface/Interface";
import ConfirmationModal from "../ConfirmationModal";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { updateTheater } from "../../redux/actions/theaterAction";
import { isResponseError } from "../../utils/customError";
import { FaRegEdit } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
interface TheaterInforProps {
  data: TheaterOwnerProfile;
  setTheaterDataResponse: (updatedData: ITheaterOwnerEntity) => void;
  setToast: (toastData: Toast) => void
}
const TheaterOwnerInfo: React.FC<TheaterInforProps> = ({ data, setTheaterDataResponse, setToast }) => {
   
  const [formData, setFormData] = useState<TheaterOwnerProfile | null>(null)
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const [profileEdit, setProfileEdit] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>()
  const closeConfirmation = () => setConfirmation(false)

  const {
    setError,
    reset,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm(
    {
      resolver: zodResolver(TheaterOwnerSchema),
      defaultValues: data
    }
  )
  const handleConfirmation: SubmitHandler<TheaterOwnerProfile> = (data) => {
    // console.log('called')
    setFormData(data);
    setConfirmation(true)
  }
  const onSubmit = async () => {
    if (!formData) return

    try {
      setLoading(true);
      // console.log('submission started')
      // console.log(formData)
      const response = await dispatch(updateTheater(formData)).unwrap();
      const { theater } = response.data
      // console.log(theater)
      if (response.status === ResponseStatus.SUCCESS) {
        clearErrors();

        setToast({
          alert: response.status,
          message: response.message
        })
        setTheaterDataResponse(theater);
        setConfirmation(false);
        setProfileEdit(false);
        reset(theater)
      }
    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode == 400) {
          setError(
            error.data.error as keyof TheaterOwnerProfile,
            {
              message: error.data.message
            }
          )
        }
        else {
          setToast(
            {
              alert: ResponseStatus.ERROR,
              message: error.data.message
            }
          )
          setProfileEdit(false)
        }
        
        
      }
    } finally {
      setConfirmation(false);
      setLoading(false)
    }
  }

  
  const update = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (profileEdit) {
      reset(data);
    }
    setProfileEdit((prev) => !prev);
  }


  return (
    <>
      {
        confirmation &&
        <ConfirmationModal
          message="do you want to update ?"
          btnType={ResponseStatus.SUCCESS}
          isOpen={confirmation}
          onClose={closeConfirmation}
          onConfirm={onSubmit}
        />
      }

      <div className="card bg-base-100 w-full md:max-w-xs shrink-0 shadow-2xl relative ">
        {
          !profileEdit ?
            (<button className=" absolute right-2 top-2" onClick={update}> <FaRegEdit /> </button>)
            : (<button className="absolute right-2 top-2 " onClick={update}> <GiCancel /> </button>)
        }
        <form className="card-body " onSubmit={handleSubmit(handleConfirmation)}>
        <div className="form-control relative">
            <label className="label">
              <span className="label-text">email</span>
            </label>
            <input
              disabled={true}
              className="input input-bordered "
              type="email" placeholder="email"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-xs absolute  -bottom-4 ">{errors.email.message}</p>}
          </div>
          <div className="form-control relative">
            <label className="label">
              <span className="label-text">adhaar number</span>
            </label>
            <input
              disabled={true}
              className="input input-bordered "
              type="text" placeholder="adhaar number"
              {...register('adhaar_number')} 
            />
            {errors.adhaar_number && <p className="text-red-500 text-xs absolute  -bottom-4 ">{errors.adhaar_number.message}</p>}
          </div>
          <div className="form-control relative">
            <label className="label">
              <span className="label-text">name</span>
            </label>
            <input
              disabled={!profileEdit}
              className="input input-bordered "
              type="text"
              placeholder="name"
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-xs absolute  -bottom-4 ">{errors.name.message}</p>}
          </div> 
          < div className="form-control relative">
            <label className="label">
              <span className="label-text">mobile number</span>
            </label>
            <input
              disabled={!profileEdit}
              className="input input-bordered "
              type="text"
              {...register('mobile_number')}
              placeholder="mobile number" />
            {errors.mobile_number && <p className="text-red-500 text-xs absolute  -bottom-4 ">{errors.mobile_number.message}</p>}
          </div>
          <label className="label">
            {/* <span  className="label-text-alt link link-hover">Forgot password?</a> */}
          </label>
          {profileEdit && <div className="form-control relative  ">
            <button type="submit" className="btn btn-primary">update</button>
          </div>}
        </form>
      </div>
    </>
  )
}

export default TheaterOwnerInfo

