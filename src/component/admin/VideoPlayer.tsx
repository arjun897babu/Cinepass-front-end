import React, { MouseEvent, useEffect, useRef } from "react"
import Hls from "hls.js"
import { Role } from "../../interface/Interface"
import { MdDelete } from "react-icons/md"


const VideoPlayer: React.FC<{ role: Role, url: string, removeHlsUrl?: () => void }> = ({ role, url, removeHlsUrl }) => {

  const deleteVideo = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    const video = videoRef.current
    if (video && Hls.isSupported()) {
      const hls = new Hls()

      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (role === Role.users) {
          video.play()
        }
      })

      // hls.on(Events.ERROR, (events, data) => {
      //   console.log(events)
      //   console.log(data)
      // })

      video.addEventListener('ended', () => {
        if (hls && removeHlsUrl) {
          removeHlsUrl();
          hls.destroy();
        }
      });

      return () => {
        if (removeHlsUrl) {
          removeHlsUrl()
        }
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

      <div className={` ${role !== Role.users && "p-2 m-3 "} relative w-full `}>
        <video className="w-full" ref={videoRef} controls >
        </video>
        {role === Role.admin && <button
          className="absolute rounded-full bg-white  z-20 top-3 right-3  hover:bg-red-400"
          onClick={deleteVideo}
        >
          <MdDelete className="text-black" size={22} />
        </button>}
      </div>

    </>
  )
}

export default VideoPlayer