import { zodResolver } from "@hookform/resolvers/zod";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm as useForms } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import useErrorHandler from "../hooks/useErrorHandler";
import { Role, ResponseStatus } from "../interface/Interface";
import { resetPasswordTheaters } from "../redux/actions/theaterAction";
import { resetPassword } from "../redux/actions/userAction";
import { AppDispatch } from "../redux/store";
import { isResponseError } from "../utils/customError";
import { changePasswordSchema } from "../utils/zodSchema";
import ConfirmationModal from "./ConfirmationModal";
import { Toast } from "./Toast2";

const ChangePasswordModal: React.FC<{ role: Role, closeModal: () => void, setToast: (toast: Toast) => void }> = ({ role, closeModal, setToast }) => {
  const modalRef = useRef<HTMLDialogElement | null>(null)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof changePasswordSchema> | null>(null);
  const dispatch = useDispatch<AppDispatch>()

  const [confirmation, setConfirmation] = useState(false);
  const closeConfirmation = () => {
    setConfirmation(false)
    setFormData(null)
  }

  useEffect(() => {
    modalRef ? modalRef.current?.showModal() : null
  }, [])

  const close = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    modalRef.current ? (modalRef.current.close(), closeModal()) : null

  }
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },

  } = useForms({ resolver: zodResolver(changePasswordSchema), defaultValues: { password: '', confirm_password: '' } })


  const onSubmit: SubmitHandler<z.infer<typeof changePasswordSchema>> = (data) => {
    setFormData(data)
    setConfirmation(true)
  }

  const handleApiError = useErrorHandler(Role.users, setToast)
  const changePassword = async () => {

    try {
      if (formData) {
        setLoading(true)
        let respones
        if (role === Role.users) {
          respones = await dispatch(resetPassword({ password: formData.password })).unwrap();

        } else {
          respones = await dispatch(resetPasswordTheaters({ password: formData.password })).unwrap();
        }

        if (respones.status === ResponseStatus.SUCCESS) {
          setFormData(null);
          closeModal()
          setToast({
            alert: ResponseStatus.SUCCESS,
            message: respones.message
          })
        }
      }

    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === 400) {
          setError(
            error.data.error as keyof z.infer<typeof changePasswordSchema>,
            { message: error.data.message }
          )
        } else {
          handleApiError(error)
          closeModal()
        }
      }

    } finally {
      setLoading(false)
      setConfirmation(false)
    }
  }
  return (
    <>

      {
        confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.SUCCESS}
          isOpen={confirmation}
          message="are you sure"
          onClose={closeConfirmation}
          onConfirm={changePassword}
        />
      }
      <dialog id="change-password-modal" ref={modalRef} className="modal   backdrop-brightness-50">
        <div className="modal-box    ">
          <h3 className="font-bold text-lg capitalize">change password</h3>
          <div className="divider m-1"></div>
          <form className="flex flex-col gap-4 " onSubmit={handleSubmit(onSubmit)} >
            < div className="form-control relative ">
              <label className="label capitalize">
                password
              </label>
              <input
                className="input input-bordered    "
                type="password"
                {...register('password')}
                placeholder="enter a new password" />
              {errors.password && <p className="text-red-500 text-xs absolute font-mono -bottom-5 ">{errors.password?.message}</p>}
            </div>
            < div className="form-control relative">
              <label className="label capitalize">
                confirm password
              </label>
              <input
                className="input input-bordered "
                type="password"
                {...register('confirm_password')}
                placeholder="re-enter the new password" />
              {errors.confirm_password && <p className="text-red-500 text-xs absolute font-mono -bottom-5 ">{errors.confirm_password.message}</p>}
            </div>

            <div className={`flex justify-end gap-3 ${loading ? 'pointer pointer-events-none' : ''}`}>
              <button className="btn btn-md capitalize" onClick={close} >close</button>
              <button
                className='btn w-20  capitalize'
                type="submit">

                {
                  !loading ?
                    'Reset'
                    : <span className="loading "></span>
                }

              </button>
            </div>
          </form>

        </div>
      </dialog>
    </>
  )
}

export default ChangePasswordModal