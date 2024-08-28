import React from "react"

export const UserProfile: React.FC = (): JSX.Element => {
  return (
    <>

      <div className="flex justify-center items-center">
        <div className="card bg-base-100 w-96 shadow-xl">
          <figure className="px-10 pt-10">
            <img
              src="https://t4.ftcdn.net/jpg/03/40/12/49/240_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg"
              alt="Shoes"
              className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Arjun </h2>
             
          </div>
        </div>

      </div>
    </>
  )
}
