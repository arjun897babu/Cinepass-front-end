import React, { MouseEvent, useState } from "react"
import Cropper, { Area } from "react-easy-crop"
import { croppedImage } from "./imageCrop";
interface CropBackdropProps {
  imgURL: string;
  cropInit?: { x: number; y: number };
  zoomInit?: number;
  aspectInit?: number;
  onCancel: () => void;
  setCroppedImageFor: (
    imgURL:string,
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
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropChange = (crop: { x: number, y: number }) => {
    setCrop(crop);
  };
  const cancelCrop = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onCancel()
  }
  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onCrop = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (croppedArea) {
      console.log(imgURL)
      const croppedImageUrl = await croppedImage(imgURL, croppedArea);
      console.log(imgURL,croppedImageUrl)
      setCroppedImageFor(imgURL, croppedImageUrl);
    }
  };

  return (
    <>
      <div className="fixed inset-0 h-full p-2  z-50 flex justify-center items-center bg-black bg-opacity-60">
        <div className="relative w-[80vw] h-full ">
          <Cropper
            image={imgURL}
            zoom={zoom}
            crop={crop}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            aspect={aspect}
            style={{ containerStyle: { width: '100%', height: '100%' }, mediaStyle: { width: 'auto', height: 'auto' } }}
          />
          <button onClick={cancelCrop} className="text-sm text-white absolute bottom-2 left-60">Cancel</button>
          <button onClick={onCrop} className="text-sm absolute text-white bottom-2 right-60">Done</button>
        </div>
      </div>
    </>
  )
}