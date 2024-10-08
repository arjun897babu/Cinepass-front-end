import React, { MouseEvent } from "react";
import { Action, IMovie, IStreamingMovieData, ITheaterMovieData } from "../../interface/Interface";
import { MovieType } from "./MovieForm";
import { formatRunTime, getIST, getMovieSrc, getSerialNumber } from "../../utils/format";
 import { FaEdit } from "react-icons/fa";
import EmptyData from "../EmptyData";

interface IMovieTableProps {
  loading: boolean;
  data: (ITheaterMovieData | IStreamingMovieData)[]
  selectedMovie: (movieId: string, action: Action) => void
  currentPage: number
  movieType: MovieType
}

const MovieTable: React.FC<IMovieTableProps> = ({ data, loading, selectedMovie, currentPage, movieType }) => {

  const updateStreamingMovie = (e: MouseEvent<HTMLButtonElement>, _id: string | undefined) => {
    e.preventDefault()
    if (!_id) {
      return
    }
    selectedMovie(_id, Action.UPDATE)
  }

  const deleteButtonClicked = (e: MouseEvent<HTMLButtonElement>, _id: string | undefined) => {
    e.preventDefault()
    if (!_id) {
      return
    }
    selectedMovie(_id, Action.DELETE)
  }

  if (loading) return <div className="loading loading-md"></div> // loading icon

  return (
    <>

      {data.length > 0 ?

        (
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="table ">
              {/* head */}
              <thead className=" ">
                <tr>
                  <th>
                  </th>
                  <th className="font-bold text-black">Name</th>
                  <th className="font-bold text-black">Release Date</th>
                  <th className="font-bold text-black text-center">Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="  ">
                {

                  data.map((movie, index) => {
                    return (
                      <tr key={`${movie._id ?? index}`}>
                        <th>
                          {getSerialNumber(currentPage, index)}
                        </th>
                        <td>
                          <div className="flex items-center gap-3   max-w-60  whitespace-nowrap overflow-hidden ">
                            <div className="avatar">
                              <div className="mask h-16 w-16">
                                <img
                                  src={getMovieSrc(movie.movie_poster) ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTITe0RQgdI1j52yUOAOx_pSjmzoZa8n_bcWA&s'}
                                  alt={movie.movie_name + ' poster'} />
                              </div>
                            </div>
                            <div>
                              <div className="max-w-60 font-semibold text-black capitalize  text-ellipsis  whitespace-nowrap overflow-hidden"> {movie.movie_name} </div>
                              <div className="text-sm opacity-50">{formatRunTime(movie.run_time)}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge font-bold rounded-none ">{getIST(movie.release_date.toString())}</span>
                        </td>
                        <td className="flex justify-center items-center gap-3">

                          <button onClick={(e) => updateStreamingMovie(e, movie._id)} className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black" data-id={movie._id}><FaEdit /></button>
                          {/* <button onClick={(e) => deleteButtonClicked(e, movie._id)} className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button> */}

                        </td>
                        {/* <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th> */}
                      </tr>

                    )
                  })
                }

              </tbody>


              {/* foot */}
              <tfoot>

              </tfoot>
            </table>
          </div >
        ) : (<div className="flex justify-center items-center"><EmptyData /></div>)}

    </>
  )
}
export default MovieTable
