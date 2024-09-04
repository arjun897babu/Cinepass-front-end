import React, { useState, ChangeEvent, MouseEvent, useRef, useEffect } from "react";
import { CiCrop } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { CropBackdrop } from "./CropBackDrop";
import { TfiControlShuffle } from "react-icons/tfi";

const ErrorAlert: React.FC = () => {
  return (
    <div role="alert" className="alert alert-error absolute rounded-none max-w-44 p-1 top-5 right-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Please Try Again</span>
    </div>
  );
};
interface ImagePreviewProp {
  defaultImg: string
  editable: boolean
  removeSelectedImage: () => void
  updateSelectedImage: (ur: string) => void
}
const ImagePreview: React.FC<ImagePreviewProp> = ({ defaultImg, editable, removeSelectedImage, updateSelectedImage }) => {
  const [images, setImages] = useState<string | null>(null);//store the dataURL 
  const [selected, setSelected] = useState<string | null>(null);//for showing the cropper ui

  const removePreview = (e: MouseEvent<HTMLButtonElement>) => {
    setImages(null)
    removeSelectedImage()
  };

  const onCancel = () => {
    setSelected(null)
  }

  useEffect(() => {
      setSelected(defaultImg)
  }, [defaultImg])

  const setCroppedImageFor = (croppedImageUrl: string) => {
    if (editable) {
      setImages(croppedImageUrl);
    }
    console.log(defaultImg,croppedImageUrl)
    updateSelectedImage(croppedImageUrl)
    onCancel()
  };

  const selectForCrop = (e: MouseEvent<HTMLButtonElement>, img: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSelected(img)
  }

  return (
    <>
      <div className="relative">
        <div className="relative">
          {selected && <CropBackdrop imgURL={selected} onCancel={onCancel} setCroppedImageFor={setCroppedImageFor} />}
          {images && (
            <div className="carousel carousel-center mb-3 bg-gray-200 space-x-4 w-full p-2">
              <div className="carousel-item border border-slate-400 h-48 w-48 relative">
                <img src={images} className=" h-full w-full object-cover" />
                {editable &&
                  <>
                    <button
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-black"
                      onClick={(e) => removePreview(e)}
                    >
                      <MdDelete className="w-auto" />
                    </button>
                    <button
                      className="absolute bg-black right-2 top-2 z-20 text-white"
                      onClick={(e) => selectForCrop(e, images)}
                    >
                      <CiCrop />
                    </button>
                  </>
                }
              </div>

            </div>

          )}
        </div>
      </div>
    </>
  );
};

export default ImagePreview;
