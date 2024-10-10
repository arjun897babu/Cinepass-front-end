import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { IGetTheaterOwnersCount, IGetUserCount, TheaterDoughnutChartLabel, UserDoughnutChartLabel } from '../../interface/Interface';
import React, { useEffect } from 'react';
import { isITheaterStat } from '../../utils/validator';

type IDoughnutChartProps = {
  chartData: IGetUserCount | IGetTheaterOwnersCount
}

const DoughnutChart: React.FC<IDoughnutChartProps> = ({ chartData }) => {
  ChartJS.register(ArcElement, Tooltip)

  const isTheaterStat = isITheaterStat(chartData)
  type ChartLabel = TheaterDoughnutChartLabel | UserDoughnutChartLabel;
  const data = {
    labels: isTheaterStat
      ? Object.values(TheaterDoughnutChartLabel) as ChartLabel[]
      : Object.values(UserDoughnutChartLabel) as ChartLabel[],
    datasets: [
      {
        label: isTheaterStat ? 'Theater' : 'User',
        data: isTheaterStat
          ? [
            chartData.verified,
            chartData.active,
            chartData.blocked,
            chartData.nonVerified,
            chartData.approved,
            chartData.pending,
            chartData.rejected,
          ]
          : [
            chartData.verified,
            chartData.active,
            chartData.blocked,
            chartData.nonVerified,
          ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          ...(isTheaterStat ? ['rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(201, 203, 207, 0.7)',] : [])

        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          ...(isTheaterStat ? ['rgba(153, 102, 255,1)',
            'rgba(255, 159, 64,1)',
            'rgba(201, 203, 207,1)',] : [])

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
    <div className='p-2 w-1/6 m-1 text-center'>
      <h1 className='capitalize  font-bold underline m-1'>{isTheaterStat ? 'Theater' : 'User'}</h1>
      <Doughnut data={data} options={{ responsive: true }} />
    </div>
  )

}


export default DoughnutChart
