import React, { MouseEvent, useEffect, useRef, useState } from "react"
import { MdDelete } from "react-icons/md"

interface IVideoPreviewProps {
  file: File;
  removeFile: () => void;
}


const VideoPreview: React.FC<IVideoPreviewProps> = ({ file, removeFile }) => {

  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setFileUrl(url)

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [file])

  const deleteVideo = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    removeFile()
    setFileUrl(null)
  }

  return (
    <>
      {fileUrl && <div className="p-2 m-3 relative w-full ">
        <video ref={videoRef} controls src={fileUrl} >
        </video>
        <button
          className="absolute rounded-full bg-white  z-20 top-3 right-3  hover:bg-red-400"
          onClick={deleteVideo}
        >
          <MdDelete className="text-black" size={22} />
        </button>
      </div>}
    </>
  )
}

export default VideoPreview