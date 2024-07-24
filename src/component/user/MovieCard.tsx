import { ITheaterMovie } from "../../interface/Interface"


const MovieCard: React.FC = ( ) => {

  return (
    <>
      <div className="  ">
        <div className="rounded-lg bg-white shadow-lg">
          <img src="https://assetscdn1.paytm.com/images/cinema/160692-f9558860-4294-11ef-99b5-d35223c98590.jpg?format=webp&imwidth=582" alt="movie poster" className="rounded-t-lg" />
          <div className="p-4 relative">
            <h2 className="mb-0.5 text-xs font-semibold overflow-hidden truncate text-ellipsis">Ajayante Randam Moshanam</h2>
            <h2 className="mb-0.5 text-sm font-normal"><span className="text-sm font-normal"> U/A </span>Malayalam</h2>
            <h2 className="mb-0.5 text-xs font-light">Action Drama Thriller</h2>
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