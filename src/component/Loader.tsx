import React from "react"
import { Bars } from 'react-loader-spinner'

export const Loader: React.FC = (): JSX.Element => {
  return (
    <div className="fixed top-0 left-0 w-full h-full  flex justify-center items-center bg-black bg-opacity-75 opacity-80  z-40 ">
      <Bars
        height="80"
        width="80"
        color="#2d708b"
        ariaLabel="bars-loading"
        visible={true}
      />
    </div>
  )
};

