import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react"
import type { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Toast2, { Toast } from "../../../component/Toast2";
import ChangePasswordModal from "../../../component/ChangePasswordModal";
import { ResponseStatus, Role } from "../../../interface/Interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchem } from "../../../utils/zodSchema";
import { late, z } from "zod";
import { useNavigate } from "react-router-dom";
import { isResponseError, UploadError } from "../../../utils/customError";
import useErrorHandler from "../../../hooks/useErrorHandler";
import ConfirmationModal from "../../../component/ConfirmationModal";
import { updateUserProfile } from "../../../redux/actions/userAction";
import { MdEdit } from "react-icons/md";
import ImagePreview from "../../../component/image_preview/ImagePreview";
import { convertFile } from "../../../utils/format";
import { isCloudinaryUrl } from "../../../utils/validator";

const UserInfo: React.FC = () => {

  const user = useSelector((state: RootState) => state.user);

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [profilePic, setProfilePic] = useState<{ profile_picture: string } | null>(null)
  const updateSelectedImage = (url: string) => {
    setProfileData({ profile_picture: url })
  }
  const removeSelectedImage = () => {
    setProfilePic(null)
    setProfileData(null)
  }
  const [loading, setLoading] = useState(false)
  const [profilePicLoading, setProfilePicLoading] = useState(false)

  const [confirmation, setConfirmation] = useState(false)
  const closeConfirmation = () => setConfirmation(false)

  const [profileData, setProfileData] = useState<z.infer<typeof userProfileSchem> | { profile_picture: string } | null>(null)

  const [toastMessage, setToastMessage] = useState<Toast | null>(null)
  const setToast = (toast: Toast) => {
    setToastMessage({
      alert: toast.alert,
      message: toast.message
    })
  }
  const clearToast = () => setToastMessage(null)

  const [showModal, setShowModal] = useState(false)
  const openModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowModal(true)
  }
  const closeModal = () => setShowModal(false)


  const {
    handleSubmit,
    register,
    setError,
    watch,
    setValue,
    formState: { errors },

  } = useForm({
    resolver: zodResolver(userProfileSchem),
    defaultValues: {
      name: user.profile?.name as string,
      mobile_number: user.profile?.mobile_number as number
    }
  })
  const handleProfileUpdate: SubmitHandler<z.infer<typeof userProfileSchem>> = (data) => {
    setConfirmation(true)
    setProfileData(data)
  }

  const handleApiError = useErrorHandler(Role.users, setToast)

  useEffect(() => {
    if (profileData && 'profile_picture' in profileData) {
      setProfilePicLoading(true)
      updateProfile();
    }
  }, [profileData]);

  const updateProfile = async () => {
    try {

      if (profileData) {
        if (!('profile_picture' in profileData)) {
          setLoading(true)
        }
        const result = await dispatch(updateUserProfile({ payload: profileData })).unwrap()
        if (result.status === ResponseStatus.SUCCESS) {
          setToast({
            alert: ResponseStatus.SUCCESS,
            message: result.message
          })
        }
      }

    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === 400) {
          setError(
            error.data.error as keyof z.infer<typeof userProfileSchem>,
            { message: error.data.message }
          )
        } else {
          handleApiError(error)
        }
      }
    } finally {
      setLoading(false)
      setProfilePicLoading(false)
      setConfirmation(false)
      setProfileData(null)
      setProfilePic(null)
    }
  }

  const imageUploadRef = useRef<HTMLInputElement | null>(null)
  const openfile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (imageUploadRef.current) {
      imageUploadRef.current.click()
    }
  }

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file) {
      convertFile(file)
        .then((result) => {
          setProfilePic({ profile_picture: result })
        })
        .catch((errors) => {
          if (errors instanceof UploadError) {
            setToast({
              alert: ResponseStatus.ERROR,
              message: errors.message
            })
          }
        })
    }
  }


  return (
    <>

      {profilePic &&
        <ImagePreview
          defaultImg={profilePic.profile_picture}
          updateSelectedImage={updateSelectedImage}
          preview={false}
          removeSelectedImage={removeSelectedImage}

        />
      }

      {toastMessage &&
        <Toast2
          alert={toastMessage.alert}
          message={toastMessage.message}
          clearToast={clearToast}
        />
      }
      {confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.SUCCESS}
          isOpen={confirmation}
          message="are you sure want to change"
          onClose={closeConfirmation}
          onConfirm={updateProfile}
        />
      }

      <div className="flex justify-center item-center m-1">
        <div className="card bg-base-100 w-3/4 shadow-xl">
          <div className="card-title  p-2 bg-sky-200">
            <div className='avatar'>
              <div className='w-24 rounded-full relative'>
                {
                  profilePicLoading ?
                    (
                      <div className="skeleton h-32 w-32 "></div>
                    )
                    :
                    (
                      <img
                        src={user.profile?.profile_picture ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'}
                        alt="user avatar"
                      />
                    )
                }

              </div>
              <button onClick={openfile} className="bottom-[7%] right-[0%] absolute ">
                <MdEdit className=" text-md glass rounded-full " />
              </button>
              <input
                type="file"
                ref={imageUploadRef}
                className="hidden"
                name="profile_picture"
                onChange={handleImageUpload}
                accept="image/*,.jpg,.jpeg,.avif"
              />
            </div>
            <h2 className=" sm:relative left-16 font-bold capitalize">Hi , {user.profile?.name}</h2>
          </div>
          <div className="card-body p-4 md:p-auto ">
            <h1 className="font-bold text-lg ">Account Details</h1>
            <div className="divider"></div>

            <form className="space-y-8 lg:w-3/4 p-3  " onSubmit={handleSubmit(handleProfileUpdate)} >

              <div className="flex flex-col sm:flex-row gap-2 w-full ">
                <label htmlFor="email" className="label w-44 font-semibold">Email</label>
                <input
                  type="text"
                  id="email"
                  className="input input-bordered w-full cursor-not-allowed  "
                  value={user.profile?.email}
                  disabled
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full relative ">
                <label htmlFor="name" className="label w-44 font-semibold">Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="input input-bordered  w-full capitalize  "

                />
                {errors.name && <p className="text-red-500 text-xs absolute left-36 *: font-mono -bottom-5 ">{errors.name?.message}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-2    w-full relative">
                <label htmlFor="mobile_number" className="label w-44  font-semibold">Mobile Number</label>
                <input
                  type="number"
                  {...register('mobile_number')}
                  className="input input-bordered  w-full "
                  placeholder="Add mobile number"
                />
                {errors.mobile_number && <p className="text-red-500 text-xs absolute font-mono left-36 -bottom-5 ">{errors.mobile_number?.message}</p>}
              </div>
              <div className="flex justify-end">
                <button className=" btn btn-sm capitalize btn-active btn-neutral" onClick={openModal}>reset password</button>
              </div>
              <div className="text-center">
                <button type="submit" className={`${loading ? 'pointer-events-none' : ''} btn  w-full sm:btn-wide bg-sky-400 `}>{!loading ? 'loading' : <i className="loading loading-xs"></i>}</button>
              </div>
            </form>
          </div>

          {
            showModal &&
            <ChangePasswordModal
              role={Role.users}
              closeModal={closeModal}
              setToast={setToast}
            />
          }

        </div >
      </div >
    </>
  )
}

export default UserInfo