import { MdEdit } from "react-icons/md"
import TheaterUpdateForm, { TheaterProps } from "./TheaterUpdateForm"
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react"
import { convertFile } from "../../utils/format"
import { UploadError } from "../../utils/customError"
import { ResponseStatus, Role } from "../../interface/Interface"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import useErrorHandler from "../../hooks/useErrorHandler"
import { updateTheater } from "../../redux/actions/theaterAction"
import ImagePreview from "../image_preview/ImagePreview"

const TheaterInfo: React.FC<TheaterProps> = ({ selectedData, setTheaterDataResponse, setToast }) => {

  const imageUploadRef = useRef<HTMLInputElement | null>(null)
  const openfile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (imageUploadRef.current) {
      imageUploadRef.current.click()
    }
  }

  const [profilePicLoading, setProfilePicLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<{ image: string } | null>(null)
  const [profileData, setProfileData] = useState<{ image: string } | null>(null)


  const updateSelectedImage = (url: string) => {
    setProfileData({ image: url })
  }
  const removeSelectedImage = () => {
    setProfilePic(null)
  }

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file) {
      convertFile(file)
        .then((result) => {
          setProfilePic({ image: result })
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

  useEffect(() => {
    if (profilePic) {
      setProfilePicLoading(true)
      updateProfile();
    }
  }, [profileData]);

  const dispatch = useDispatch<AppDispatch>()
  const handleApiError = useErrorHandler(Role.theaters, setToast);

  const updateProfile = async () => {
    try {

      if (profileData) {
        const result = await dispatch(updateTheater({ image: profileData.image })).unwrap()
        if (result.status === ResponseStatus.SUCCESS) {
          setTheaterDataResponse(result.data.theater)
          setToast({
            alert: ResponseStatus.SUCCESS,
            message: result.message
          })
        }
      }

    } catch (error) {

      handleApiError(error)

    } finally {
      setProfilePicLoading(false)
      setProfilePic(null)
      setProfileData(null)
    }
  }
  return (
    <>

      {profilePic &&
        <ImagePreview
          defaultImg={profilePic.image}
          updateSelectedImage={updateSelectedImage}
          preview={false}
          removeSelectedImage={removeSelectedImage}
          aspectInit={260 / 200}
        />
      }

      <div className="card bg-base-100   shadow-xl relative">
        <div className="absolute right-2 top-2">
          <TheaterUpdateForm
            selectedData={selectedData}
            setTheaterDataResponse={setTheaterDataResponse}
            setToast={setToast}
          />
        </div>

        <div className="card-body items-center text-center ">
          <figure className="p-2">
            <div className="relative  h-[200px] w-[260px]">
              {
                profilePicLoading ?
                  (
                    <div className="skeleton  h-[200px] w-[260px]"></div>
                  ) :
                  (
                    <img
                      src={selectedData.image ?? "https://www.hollywoodreporter.com/wp-content/uploads/2023/04/Samsung-Onyx-at-Star-Cinema-Grill_094128-H-2023.jpg?w=1296&h=730&crop=1"}
                      alt={selectedData.theater_name + '_image'}
                      className="rounded-xl h-full w-full object-contain "
                      loading="lazy"
                    />
                  )

              }


              <button onClick={openfile} className="absolute bottom-[-1%] right-[-1%]">
                <MdEdit className=" text-md z-20 rounded-full  glass" size={22} />
              </button>
              <input
                type="file"
                ref={imageUploadRef}
                className="hidden"
                name="profile_picture"
                onChange={handleImageUpload}
                accept="image/*,.jpg,.jpeg"
              />

            </div>
          </figure>
          <h2 className="max-w-full break-words text-2xl font-bold ">{selectedData.theater_name}</h2>
          <p>{selectedData.address}</p>
          <p>{selectedData.city}</p>
        </div >
      </div >

    </>
  )
}

export default TheaterInfo