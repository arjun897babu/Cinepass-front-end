import { lazy, useEffect, useState } from "react"
import { IStreamingMovieData, ResponseStatus } from "../../interface/Interface"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { getUserStreamingMovies } from "../../redux/actions/userAction"
import { Loader } from "../../component/Loader"
const StreamCarousel = lazy(() => import("../../component/user/StreamCarousel"))
const MovieCarousel = lazy(() => import("../../component/user/MovieCarousel"))

const StreamHomePage = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [upcoming, setupComing] = useState<IStreamingMovieData[]>([])
  const [running, SetRunning] = useState<IStreamingMovieData[]>([])

  async function fetchStreamingMovies() {
    try {
      setLoading(true)

      const response = await dispatch(getUserStreamingMovies()).unwrap()

      if (response.status === ResponseStatus.SUCCESS) {

        SetRunning(response.data.running)
        setupComing(response.data.upcoming)
      }

    } catch (error) {

    } finally {
      setLoading(false)

    }

  }

  useEffect(() => {
    fetchStreamingMovies()
  }, [])

  if (loading || (running === undefined && upcoming === undefined)) return <Loader />

  return (
    <>

      <StreamCarousel
        movieDetails={running}
      />


      <div className="p-2">
        <div className="bg-base-100">
          {
            running.length > 0 &&
            <div className="p-2 space-y-5  ">
              <h1 className="capitalize font-bold text-2xl ml-2">new on stream</h1>

              <MovieCarousel movieDetails={running} />

            </div>}
          {upcoming.length > 0 && <div className=" p-2 space-y-5  ">
            <h1 className="capitalize font-bold text-2xl ml-2">upcoming release</h1>
            <MovieCarousel movieDetails={upcoming} />
          </div>}
        </div>
      </div>
    </>
  )
}

export default StreamHomePage