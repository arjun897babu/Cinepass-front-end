import React, { MouseEvent, useEffect, useRef } from "react"
import Hls, { ErrorData, ErrorDetails, ErrorTypes, Events } from "hls.js"
import { Role } from "../../interface/Interface"
import { MdDelete } from "react-icons/md"


const VideoPlayer: React.FC<{ role: Role, url?: string }> = ({ url = 'https://res.cloudinary.com/dqakjy0hk/video/upload/sp_auto/v1728090825/zz8f0aoplwwd2oeobqaz.m3u8' }) => {

  const deleteVideo = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    const video = videoRef.current
    if (video && Hls.isSupported()) {
      const hls = new Hls()

      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // video.play()
      })

      hls.on(Events.ERROR, (events, data) => {
        console.log(events)
        console.log(data)
      })

      return () => {
        hls.destroy()
      }
    } else if (video) {
      video.src = url
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    }
  }, [url])
  return (
    <>

      <div className="p-2 m-3 relative w-full ">
        <video ref={videoRef} controls >
        </video>
        <button
          className="absolute rounded-full bg-white  z-20 top-3 right-3  hover:bg-red-400"
          onClick={deleteVideo}
        >
          <MdDelete className="text-black" size={22} />
        </button>
      </div>

    </>
  )
}

export default VideoPlayer