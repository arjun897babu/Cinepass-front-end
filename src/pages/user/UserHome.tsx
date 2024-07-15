import React from "react"
import { Carousel } from "../../component/user/Carousel"
import { SearchWithFilters } from "../../component/user/footer/SearchWithFilters"


const UserHome: React.FC = () => {
  return (
    <>
      <Carousel />
      <SearchWithFilters />
      <div className="container">
        <div className="filter px-5 py-6">


        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="m-4 mb-8  px-4 w-72 ">
            <div className="rounded-lg bg-white shadow-lg">
              <img src="https://assetscdn1.paytm.com/images/cinema/160692-f9558860-4294-11ef-99b5-d35223c98590.jpg?format=webp&imwidth=582" alt="movie poster" className="rounded-t-lg" />
              <div className="p-4 relative">
                <h2 className="mb-0.5 text-base font-semibold">Ajayante Randam Moshanam</h2>
                <h2 className="mb-0.5 text-sm font-normal"><span className="text-sm font-normal"> U/A </span>Malayalam</h2>
                <h2 className="mb-0.5 text-xs font-light">Action Drama Thriller</h2>
                <div className="absolute text-yellow-50  font-bold -top-14">
                  <span className="font-light">Release Date</span> <br />
                  18 JUL 24
                </div>
              </div>
            </div>
          </div>
          <div className="m-4 mb-8  px-4 w-72 ">
            <div className="rounded-lg bg-white shadow-lg">
              <img src="https://assetscdn1.paytm.com/images/cinema/160692-f9558860-4294-11ef-99b5-d35223c98590.jpg?format=webp&imwidth=582" alt="movie poster" className="rounded-t-lg" />
              <div className="p-4 relative">
                <h2 className="mb-0.5 text-base font-semibold">Ajayante Randam Moshanam</h2>
                <h2 className="mb-0.5 text-sm font-normal"><span className="text-sm font-normal"> U/A </span>Malayalam</h2>
                <h2 className="mb-0.5 text-xs font-light">Action Drama Thriller</h2>
                <div className="absolute text-yellow-50  font-bold -top-14">
                  <span className="font-light">Release Date</span> <br />
                  18 JUL 24
                </div>
              </div>
            </div>
          </div>
          <div className="m-4 mb-8  px-4 w-72 ">
            <div className="rounded-lg bg-white shadow-lg">
              <img src="https://assetscdn1.paytm.com/images/cinema/160692-f9558860-4294-11ef-99b5-d35223c98590.jpg?format=webp&imwidth=582" alt="movie poster" className="rounded-t-lg" />
              <div className="p-4 relative">
                <h2 className="mb-0.5 text-base font-semibold">Ajayante Randam Moshanam</h2>
                <h2 className="mb-0.5 text-sm font-normal"><span className="text-sm font-normal"> U/A </span>Malayalam</h2>
                <h2 className="mb-0.5 text-xs font-light">Action Drama Thriller</h2>
                <div className="absolute text-yellow-50  font-bold -top-14">
                  <span className="font-light">Release Date</span> <br />
                  18 JUL 24
                </div>
              </div>
            </div>
          </div>
          <div className="m-4 mb-8  px-4 w-72 ">
            <div className="rounded-lg bg-white shadow-lg">
              <img src="https://assetscdn1.paytm.com/images/cinema/160692-f9558860-4294-11ef-99b5-d35223c98590.jpg?format=webp&imwidth=582" alt="movie poster" className="rounded-t-lg" />
              <div className="p-4 relative">
                <h2 className="mb-0.5 text-base font-semibold">Ajayante Randam Moshanam</h2>
                <h2 className="mb-0.5 text-sm font-normal"><span className="text-sm font-normal"> U/A </span>Malayalam</h2>
                <h2 className="mb-0.5 text-xs font-light">Action Drama Thriller</h2>
                <div className="absolute text-yellow-50  font-bold -top-14">
                  <span className="font-light">Release Date</span> <br />
                  18 JUL 24
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </>
  )
}


export default UserHome