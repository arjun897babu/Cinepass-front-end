import React, { useState } from "react"
import { ResponseStatus, Role } from "../../interface/Interface"
import { SubmitHandler, useForm as useForms } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StreamPlanSchema } from "../../utils/zodSchema"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { z } from "zod"
import ConfirmationModal from "../ConfirmationModal"
import { addStreamPlan, editStreamPlan } from "../../redux/actions/adminAction"
import { isResponseError } from "../../utils/customError"
import { Toast } from "../Toast2"
import useErrorHandler from "../../hooks/useErrorHandler"

interface IStreamingPlanFormProps {
  closeModal: () => void
  defaultData?: z.infer<typeof StreamPlanSchema>;
  _id?: string
  updateToast: (toast: Toast) => void,
  updatePlanState?: () => void
}

const StreamingPlanForm: React.FC<IStreamingPlanFormProps> = ({
  closeModal,
  _id,
  defaultData,
  updateToast,
  updatePlanState
}) => {

  const handleApiError = useErrorHandler(Role.admin, updateToast)
  const dispatch = useDispatch<AppDispatch>()
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const onClose = () => setConfirmation(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<z.infer<typeof StreamPlanSchema> | null>(null);
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForms({
    resolver: zodResolver(StreamPlanSchema),
    defaultValues: defaultData
  })
  const handleFormSubmit: SubmitHandler<z.infer<typeof StreamPlanSchema>> = (data) => {
    setFormData(data)
    setConfirmation(true)
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      if (formData) {
        let response
        if (_id && defaultData) {
          response = await dispatch(editStreamPlan({ planId: _id, data: formData })).unwrap()
        } else {
          response = await dispatch(addStreamPlan(formData)).unwrap()
        }

        if (response.status === ResponseStatus.SUCCESS) {
          updateToast({
            alert: ResponseStatus.SUCCESS,
            message: response.message
          })
          closeModal()
        }

      }
    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === 400) {
          setError(
            error.data.error as keyof z.infer<typeof StreamPlanSchema>,
            { message: error.data.message }
          )
        } else {
          handleApiError(error)
          closeModal()
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {
        confirmation &&
        <ConfirmationModal
          isOpen={confirmation}
          message="Are you sure"
          onClose={onClose}
          btnType={ResponseStatus.SUCCESS}
          onConfirm={onSubmit}

        />
      }
      <form className="mt-5 space-y-7" onSubmit={handleSubmit(handleFormSubmit)} >
        <div className="gap-3 w-full relative flex justify-center items-center text-center">
          <label className="w-24 font-bold text-left capitalize">Plan Name</label>
          <div className="flex flex-grow flex-col relative">
            <input
              id="planName"

              {...register('planName')}
              type="text"
              className="input w-full border border-gray-400 text-gray-500 max-w-xs"
              placeholder="Enter plan name"
            />
            {errors.planName &&
              <small
                className='text-red-600 capitalize absolute -bottom-5 left-0 font-mono '
              >{errors.planName.message}</small>}
          </div>

        </div>
        <div className="gap-3 w-full relative flex justify-center items-center text-center">
          <label className="w-24 font-bold text-left capitalize">Price</label>
          <div className="flex flex-grow flex-col relative">
            <input
              type="number"
              {...register('price')}
              className="input w-full border border-gray-400 text-gray-500 max-w-xs"
              placeholder="Enter Price"
            />
            {errors.price &&
              <small
                className='text-red-600 capitalize absolute -bottom-5 left-0 font-mono '
              >{errors.price.message}</small>}
          </div>
        </div>
        <div className="gap-3 w-full relative flex justify-center items-center text-center">
          <label className="w-24 font-bold text-left capitalize">validity</label>
          <div className="flex flex-grow flex-col relative">
            <input
              type="number"
              {...register('validity')}
              className="input w-full border border-gray-400 text-gray-500 max-w-xs"
              placeholder="Enter validity"
            />
            {errors.validity &&
              <small
                className='text-red-600 capitalize absolute -bottom-5 left-0 font-mono '
              >{errors.validity.message}</small>}
          </div>

        </div>
        <div className="modal-action justify-center">
          <button className="btn btn-wide btn-neutral" type="submit" disabled={loading}>
            {
              !loading ?
                'submit'
                : <div className="loading loading-xs"></div>
            }
          </button>
        </div>
      </form>
    </>
  )
}

export default StreamingPlanForm