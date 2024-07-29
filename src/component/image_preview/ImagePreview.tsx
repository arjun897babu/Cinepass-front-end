import React, { useState, ChangeEvent, MouseEvent, useRef } from "react";
import { CiCrop } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { CropBackdrop } from "./CropBackDrop";

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
  setCloudImg: (img: string[]) => void;
  setCroppedCloudImg: (prevURL: string, imageURL: string) => void;
  defaultImg: string[] | []
}
const ImagePreview: React.FC<ImagePreviewProp> = ({ setCloudImg, setCroppedCloudImg, defaultImg }) => {
  const [images, setImages] = useState<string[] | []>(defaultImg);//store the dataURL 
  const [uploadError, setUploadError] = useState<boolean>(false); //for showing the error while uploading
  const [selected, setSelected] = useState<string | null>(null);//for showing the cropper ui
  const fileInputRef = useRef<HTMLInputElement>(null);//fileInput for uploading the image

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
        console.log(fileInputRef.current.files)
        console.log('local files', fileInputRef.current.files)
        const imgSrc: string[] = [];
        for (let x of fileInputRef.current.files) {
          const file: File = x;
          let imageDataUrl: string = URL.createObjectURL(file);
          imgSrc.push(imageDataUrl);
        }
        setImages((prev) => [...prev, ...imgSrc]);
        setCloudImg(imgSrc)
      }

    } catch (error) {
      if (error instanceof Error) {
        setUploadError(true);
        setTimeout(() => {
          setUploadError(false);
        }, 2000);
      }
    }
  };

  const openFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const deleteImage = (e: MouseEvent<HTMLButtonElement>, imgName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setImages((prevImages) => prevImages.filter((img) => img !== imgName));
  };

  const onCancel = () => {
    setSelected(null)
  }

  const setCroppedImageFor = (oldURL: string, croppedImageUrl: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img === oldURL
          ? croppedImageUrl
          : img
      )
    );

    setCroppedCloudImg(oldURL, croppedImageUrl)
    onCancel()
  };
  const updateSelected = (e: MouseEvent<HTMLButtonElement>, img: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSelected(img)
  }

  return (
    <>
      <div className="relative">


        <div className="mb-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            multiple
            className=" hidden"
          />
          <button onClick={openFile} className="file-input btn bg-gray-200">Choose file</button>
        </div>
        <div className="relative">
          {uploadError && <ErrorAlert />}

          {selected && <CropBackdrop imgURL={selected} onCancel={onCancel} setCroppedImageFor={setCroppedImageFor} />}
          {images.length > 0 && (
            <div className="carousel carousel-center mb-3 bg-gray-200 space-x-4 w-full p-2">
              {images.map((img, index: number) => (
                <div key={index} className="carousel-item border border-slate-400 h-48 w-48 relative">
                  <img src={img} className=" h-full w-full object-cover" />
                  <button
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-black"
                    onClick={(e) => deleteImage(e, img)}
                  >
                    <MdDelete className="w-auto" />
                  </button>
                  <button
                    className="absolute bg-black right-2 top-2 z-20 text-white"
                    onClick={(e) => updateSelected(e, img)}
                  >
                    <CiCrop />
                  </button>
                </div>
              ))}
            </div>

          )}
        </div>
      </div>
    </>
  );
};

export default ImagePreview;
