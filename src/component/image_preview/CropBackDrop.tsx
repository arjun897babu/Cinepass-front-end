import React, { MouseEvent, useState } from "react"
import Cropper, { Area } from "react-easy-crop"
import { croppedImage } from "./imageCrop";
import { ImCheckmark, ImCross } from "react-icons/im";
interface CropBackdropProps {
  imgURL: string;
  cropInit?: { x: number; y: number };
  zoomInit?: number;
  aspectInit?: number;
  onCancel: () => void;
  setCroppedImageFor: (
    croppedImageUrl: string
  ) => void;
}
export const CropBackdrop: React.FC<CropBackdropProps> = (
  {
    imgURL,
    aspectInit = 4 / 3,
    zoomInit = 1,
    cropInit = { x: 0, y: 0 },
    onCancel,
    setCroppedImageFor
  }
) => {

  const [zoom, setZoom] = useState<number>(zoomInit);
  const [crop, setCrop] = useState<{ x: number; y: number }>(cropInit);
  const [aspect, setAspect] = useState<number>(aspectInit);
  console.log(setAspect)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropChange = (crop: { x: number, y: number }) => {
    setCrop(crop);

  };
  const cancelCrop = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onCancel()
  }
  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedArea)
    setCroppedArea(croppedAreaPixels);
  };

  const onCrop = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (croppedArea) {
      const croppedImageUrl = await croppedImage(imgURL, croppedArea);
      setCroppedImageFor(croppedImageUrl);
    }
  };

  return (
    <>
      <div className="fixed inset-0 h-full p-2  z-50 flex justify-center items-center bg-black bg-opacity-60">
        <div className="relative w-[70vw] h-full ">
          <Cropper
            image={imgURL}
            zoom={zoom}
            crop={crop}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            aspect={aspect}
          style={{ containerStyle: { width: '100%', height: '100' }, mediaStyle: { width: 'auto', height: 'auto' } }}
          />
          <div className="bg-white absolute w-full flex gap-2">
            <button onClick={onCrop} className="bg-sky-300 hover:bg-sky-200 text-sm  btn-sm "> <ImCheckmark /></button>
            <button onClick={cancelCrop} className="bg-sky-300 hover:bg-sky-200 text-sm btn-sm"> <ImCross /></button>
          </div>
        </div>
      </div>
    </>
  )
}