import React, { memo } from "react"
interface DashBoardCardProps {
  header: string;
  data: string
}
export const DashBoardCard: React.FC<DashBoardCardProps> = memo(({ data, header }) => {
  return (
    <>
      <div className="rounded-lg w-80 text-center bg-slate-800 text-white h-36 flex flex-col justify-center items-center gap-2 shadow-lg p-4">
        <h1 className="text-2xl font-semibold text-neutral-300">{header}</h1>
        <span className="text-2xl font-extrabold text-neutral-50">{data}</span>
      </div>
    </>
  )
})



