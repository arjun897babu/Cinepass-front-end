import React, {  useEffect } from "react"
import { ITheaterOwnerEntity } from "../../interface/theater/ITheaterOwner";
import { IMovie } from "../../interface/Interface";
import { Link, useLocation } from "react-router-dom";
import { getIST } from "../../utils/format";

interface MoviesTheatersDropdownPorps {
  item: 'movies' | 'theaters'
  moviesOrTheater: Partial<ITheaterOwnerEntity>[] | IMovie[]
  city: string;
}

const MoviesTheatersDropdown: React.FC<MoviesTheatersDropdownPorps> = ({ item, moviesOrTheater, city }) => {
  const location = useLocation()

  useEffect(() => {
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
      dropdown.classList.remove('.dropdown-open');
    }
  }, [location.pathname]);
  return (
    <>
      <div className="dropdown dropdown-hover ">
        <div
          tabIndex={0}
          role="button"
          className="hover:bg-blue-100 uppercase p-3 font-semibold cursor-pointer pointer-events-none"

        >
          {item === 'movies' ? 'movies' : 'theaters'}
        </div>
        <div className="dropdown-content bg-base-100 rounded-box z-[1] shadow absolute border-t-2 border-b-gray-500   left-1/2 transform -translate-x-1/2 w-[70vw] max-w-[80vw]">
          <h1 className="capitalize text-xl font-bold p-6  ">{item === 'movies' ? 'now playing' : 'cinemas in ' + city}</h1>
          <ul className=" grid grid-cols-2 gap-4 p-6">
            {moviesOrTheater.length > 0 ? (
              moviesOrTheater.map((data) => {
                if (item === 'movies') {
                  const movie = data as IMovie;
                  const releaseDate = new Date(movie.release_date);
                  const currentDate = new Date();
                  const bookingDate = getIST(currentDate <= releaseDate ? releaseDate.toString() : currentDate.toString());
                  return (
                    <li key={movie._id || movie.slug}>
                      <Link to={`/movie/${movie.slug}?bookingDate=${bookingDate}`} className="">
                        <div className="flex items-center gap-3 border-b-2 pb-1">
                          <div className="avatar">
                            <div className="mask h-10 w-10">
                              <img
                                src={movie.movie_poster as string}
                                alt={movie.movie_name}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold capitalize">{movie.movie_name}</div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                } else {
                  const theater = data as ITheaterOwnerEntity;
                  return (
                    <li key={theater._id}>
                      <Link to={`/theater/${theater.slug}`} className="" state={{ theater }} >
                        <div className="flex items-center gap-3 border-b-2 pb-1">
                          <div>
                            <div className="font-semibold text-base capitalize"> {theater.theater_name}  </div>
                            <div className="text-sm opacity-50  overflow-hidden truncate max-w-[200px]"> {theater.address}  </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                }
              })
            ) : (
              <li className="text-gray-500">No {item} available</li>
            )}
          </ul>
        </div>

      </div >
    </>
  )
}


export default MoviesTheatersDropdown