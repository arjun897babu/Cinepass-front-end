import { IMovie } from "../../interface/Interface"
import { getMovieSrc } from "../../utils/format";

interface MovieCardProps {
  movie: IMovie
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {

  return (
    <>
      <div className=" ">
        <div className="rounded-lg bg-white shadow-lg">
          <img src={getMovieSrc(movie.movie_poster)??'https://static.vecteezy.com/system/resources/thumbnails/022/059/000/small/no-image-available-icon-vector.jpg'} alt="movie poster" className="rounded-t-lg" />
          <div className="p-4 relative">
            <h2 className="mb-0.5 text-xs lg:text-lg capitalize font-semibold overflow-hidden truncate text-ellipsis">{movie.movie_name}</h2>
            <h2 className="mb-0.5 text-sm font-normal"><span className="text-sm font-normal"> </span>{movie.languages.join(',')}</h2>
            <h2 className="mb-0.5 text-xs font-light">{movie.languages.join(',')}</h2>
            <div className="absolute text-yellow-50  font-bold -top-14">
              <span className="font-light">Release Date</span> <br />
              18 JUL 24
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default MovieCard