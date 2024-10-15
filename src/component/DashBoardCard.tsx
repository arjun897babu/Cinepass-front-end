import React, { memo } from "react"
import { FiUsers } from "react-icons/fi";
import { GiTheater } from "react-icons/gi";
interface DashBoardCardProps {
  header: 'user' | 'theaters' | 'screen' | 'shows' | 'Tickets' | 'profit';
  data: number
}
export const DashBoardCard: React.FC<DashBoardCardProps> = memo(({ data, header }) => {
  return (

    <div className="stats shadow bg-cyan-400">
      <div className="stat">
        <div className="stat-figure text-black">
          {
            header === 'user' ?
              <FiUsers size={30} />
              : <GiTheater size={30} />
          }
        </div>
        <div className="stat-title">Total {header}</div>
        <div className="stat-value">{data}</div>
      </div>
    </div>
  )
})



