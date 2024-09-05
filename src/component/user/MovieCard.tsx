import { memo } from "react";
import { IMovie } from "../../interface/Interface"
import { getIST, getMovieSrc } from "../../utils/format";

interface MovieCardProps {
  movie: IMovie
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    
  return (
    <>
      <div className=" ">
        <div className="rounded-lg bg-white shadow-lg">
          <img src={getMovieSrc(movie.movie_poster) ?? 'https://static.vecteezy.com/system/resources/thumbnails/022/059/000/small/no-image-available-icon-vector.jpg'} alt="movie poster" className="rounded-t-lg" />
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
    </>
  )
};

export default memo(MovieCard)