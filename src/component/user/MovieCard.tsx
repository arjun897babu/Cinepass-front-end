import { lazy, memo } from "react";
import { getIST, getMovieSrc } from "../../utils/format";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
const EmptyData = lazy(() => import("../EmptyData"))
import { Link } from "react-router-dom";



const MovieCard: React.FC = () => {

  const { movies } = useSelector((state: RootState) => state.user)

 
  if (!movies) {
    return (

      <div >
        <EmptyData />
      </div>
    )
  };

  return (
    <>
      {
        (movies.map((movie) => {
          const releaseDate = new Date(movie.release_date);
          const currentDate = new Date();
          const bookingDate = getIST(currentDate <= releaseDate ? releaseDate.toString() : currentDate.toString());
          return <Link
            key={movie._id}
            to={`/movie/${movie.slug}?bookingDate=${bookingDate}`}>
            <div key={movie.slug} className=" ">
              <div className="rounded-lg bg-white shadow-lg">
                <img
                  src={getMovieSrc(movie.movie_poster) ?? 'https://static.vecteezy.com/system/resources/thumbnails/022/059/000/small/no-image-available-icon-vector.jpg'}
                  alt={`${movie.movie_name} poster`}
                  className="rounded-t-lg h-full w-full object-contain"
                  loading="lazy" 
                />
                <div className="p-4 relative">
                  <h2 className="mb-0.5 text-xs lg:text-lg capitalize font-semibold overflow-hidden truncate text-ellipsis">{movie.movie_name}</h2>
                  <h2 className="mb-0.5 text-sm font-normal capitalize"> {movie.languages.join(',')}</h2>
                  <h2 className="mb-0.5 text-xs font-light capitalize">{movie.genres.join(',')}</h2>
                  <div className="absolute text-yellow-50  font-bold -top-14">
                    <span className="font-light">Release Date</span> <br />
                    {getIST(movie.release_date as string)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        }))
      }

    </>
  )
};

export default memo(MovieCard)