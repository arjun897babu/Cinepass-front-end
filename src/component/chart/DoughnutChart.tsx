import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { IGetScreenCount, IGetShowCountByScreen, IGetTheaterOwnersCount, IGetTicketCount, IGetUserCount } from '../../interface/Interface';
import React, { useEffect } from 'react';
import { isArray } from 'chart.js/helpers';

type IDoughnutChartProps = {
  label: 'user' | 'theaters' | 'screen' | 'shows' | 'tickets' | 'profit';
  chartData: IGetUserCount | IGetTheaterOwnersCount | IGetTicketCount | IGetScreenCount | IGetShowCountByScreen[]
}

ChartJS.register(ArcElement, Tooltip)
const DoughnutChart: React.FC<IDoughnutChartProps> = ({ label, chartData }) => {

  const data = {
    labels: isArray(chartData) ? chartData.map((show) => show.screenName) : Object.keys(chartData),
    datasets: [
      {
        data: isArray(chartData) ? chartData.map((show) => show.showCount) : Object.values(chartData),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(201, 203, 207, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255,1)',
          'rgba(255, 159, 64,1)',
          'rgba(201, 203, 207,1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    return () => {
      ChartJS.unregister(ArcElement, Tooltip)
    }
  }, [])

  return (
    <div className='p-2 w-full  sm:w-1/6 m-1 text-center'>
      <h1 className='capitalize  font-bold underline m-1'>{label}</h1>
      <Doughnut data={data} options={{ responsive: true }} />
    </div>
  )

}


export default DoughnutChart
