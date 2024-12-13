import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, Tooltip, BarController, CategoryScale, LinearScale } from 'chart.js'
import React, { useEffect, useState } from 'react'
import { IList, IRevenueResponse, Period, RevenueFilter } from '../../interface/Interface'
ChartJS.register(BarElement, Tooltip, BarController, CategoryScale, LinearScale)
const BarChart: React.FC<{ revenue: 'screen' | 'stream', data: IRevenueResponse, changeFilter: (key: keyof RevenueFilter, value: Period | string) => void,period:string }> = ({ data, revenue, changeFilter,period }) => {
  const [id, setId] = useState<string>()

  const ChartData = {
    labels: Object.keys(data.revenue.data),
    datasets: [
      {
        label: data.revenue.name,
        data: Object.values(data.revenue.data),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value as string;
    setId(id)
    changeFilter(revenue === 'stream' ? 'movieId' : 'screenId', id);
  };


  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPeriod = event.target.value as Period;
    changeFilter('period', selectedPeriod);
  };


  useEffect(() => {
    setId(data.revenue.id)
    return () => {
      ChartJS.unregister(BarElement, Tooltip, BarController, CategoryScale, LinearScale);
    }
  }, [])
  return (
    <>
      <div className="flex gap-2 w-full">
        <div className="w-3/4 text-center ">

          <h1 className='font-extrabold text-lg p-2 m-0'>Revenue</h1>

          <Bar data={ChartData} options={{ responsive: true }} />
        </div>
        <div className="space-x-1 mt-12">
          <select 
            onChange={handleChange}
            value={id}
            className=' select-info font-bold text-sm capitalize'>
            {data.list.map((item: IList) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            onChange={handlePeriodChange}
            className='select capitalize font-bold   select-info '   >
            <option value="week" defaultValue={period}>week</option>
            <option value="month">month</option>
            <option value="year">year</option>
          </select>
        </div>
      </div>

    </>
  )

}

export default BarChart