import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { ITheaterDetailResponse } from "../../interface/theater/ITheaterDetail";
import { useForm } from "../../hooks/UseForm";
import { Role } from "../../interface/Interface";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import ImagePreview from "../image_preview/ImagePreview";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateTheater } from "../../redux/actions/theaterAction";
const uploadImages = async (images: string[]) => {
  const promises = images.map(image => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'CinepassTheaters');
    return axios.post(`https://api.cloudinary.com/v1_1/dqakjy0hk/image/upload`, formData);
  });

  const responses = await Promise.all(promises);
  return responses.map(response => response.data.secure_url);
};

const TheaterUpdateForm: React.FC<{ data: ITheaterDetailResponse }> = ({ data }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [cloudImg, setCloudImg] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>()

  const handleImagesToUpload = (ulr: string[]) => {
    setCloudImg((prev) => [...prev, ...ulr])
  }

  const croppedImageToUpload = (prevURL: string, imageURL: string) => {
    console.log(cloudImg,prevURL,imageURL)
    setCloudImg((prevImages) =>
      prevImages.map((img) =>
        img === prevURL
          ? img = imageURL
          : img
      )
    );
  }

  const { formData, handleChange, inputError, setInputError, setFormData } = useForm({
    theater_name: data.theater_Name,
    theater_license: data.theater_license,
    city: data.city,
    address: data.address,
  }, Role.theaters);

  const { handleSubmit } = useFormSubmit(formData, setInputError);

  const showModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const modal = document.getElementById('theater_details') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isValid = handleSubmit(e)
    try {
      if (isValid) {
        const images = cloudImg.map((items) => items)
        console.log(images)
        setLoading((prev) => !prev)
        const imageUrls = await uploadImages(images);
        console.log(imageUrls)
        const response = await dispatch(updateTheater({ ...formData, images: imageUrls }));
        console.log('updated response from the server', response)
        setLoading((prev) => !prev)
      }
    } catch (error) {
      console.log(error)
      setLoading((prev) => !prev)
    }
  };

  console.log('cloud image before', cloudImg)



  return (
    <>
      <button className="btn" onClick={showModal}>Update</button>
      <dialog id="theater_details" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="modal-action mt-0">
            <form method="dialog">
              <button className="btn btn-sm btn-circle">✕</button>
            </form>
          </div>
          <h3 className="font-extrabold capitalize text-2xl text-center mb-2">Update Theater Details</h3>
          <form action="#" className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="sr-only" htmlFor="theater_name">Theater Name</label>
              <input
                className="w-full rounded-lg focus:outline-none border p-3 text-sm"
                placeholder="Theater Name"
                type="text"
                id="theater_name"
                name="theater_name"
                value={formData.theater_name}
                onChange={handleChange}
              />
              {inputError.theater_name && <p className="text-red-500 text-xs">{inputError.theater_name}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="theater_license">Theater License</label>
                <input
                  className="w-full focus:outline-none rounded-lg border p-3 text-sm"
                  placeholder="Theater License"
                  type="text"
                  id="theater_license"
                  name="theater_license"
                  value={formData.theater_license}
                  onChange={handleChange}
                />
                {inputError.theater_license && <p className="text-red-500 text-xs">{inputError.theater_license}</p>}
              </div>

              <div>
                <label className="sr-only" htmlFor="city">City</label>
                <input
                  className="w-full focus:outline-none rounded-lg border p-3 text-sm"
                  placeholder="City"
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                {inputError.city && <p className="text-red-500 text-xs">{inputError.city}</p>}
              </div>
            </div>

            <div>
              <label className="sr-only" htmlFor="address">Address</label>
              <input
                className="w-full rounded-lg focus:outline-none border p-3 text-sm"
                placeholder="Address"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              {inputError.address && <p className="text-red-500 text-xs">{inputError.address}</p>}
            </div>

            <div>
              <ImagePreview setCloudImg={handleImagesToUpload} setCroppedCloudImg={croppedImageToUpload} defaultImg={data.images} />

            </div>

            <button className="btn btn-sm float-right" type="submit">
              {loading ? (
                <span className="loading loading-spinner loading-lg"></span>
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
