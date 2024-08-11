import React, { memo, MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useLoggedOwner } from "../hooks/useLoggedUser";
import { Role } from "../interface/Interface";

interface RedirectPath {
  redirectPath?: string
}

export const ErroPage: React.FC<RedirectPath> = ({ redirectPath }) => {

  const navigate = useNavigate();
  const { city } = useLoggedOwner(Role.users)
  if (!city) navigate('/')
  const navigateHome = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      navigate(`/home/${city}`);
    }
  }

  return (
    <>
      <div className="grid h-screen place-content-center bg-white px-4"  >
        <div className="text-center"  >
          <h1 className="text-9xl font-black text-gray-200">404</h1>

          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>

          <p className="mt-4 text-gray-500">We can't find that page.</p>
          <button type="button" className="mt-6 inline-block rounded px-5 py-3 text-sm font-medium text-black hover:bg-black hover:text-white focus:outline-none" onClick={navigateHome}>
            Back to Home
          </button>

        </div>
      </div>
    </>
  )
} 