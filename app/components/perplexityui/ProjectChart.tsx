// components/dashboard/ProjectsChart.tsx
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProjectsChart() {
  const data = {
    labels: ['OverK', 'MagnumShop', 'Doctor+', 'AfterMidnight'],
    datasets: [
      {
        data: [44, 24, 18, 14],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(249, 115, 22)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-medium">Projects worked</h3>
        <span className="text-red-500 text-sm">-5% <span className="text-red-500">↓</span></span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">4</span>
            <span className="text-xs text-gray-400">projects</span>
          </div>
        </div>
        
        <ul className="flex-1">
          {[
            { name: 'OverK', percentage: '44%', color: 'bg-blue-500' },
            { name: 'MagnumShop', percentage: '24%', color: 'bg-green-500' },
            { name: 'Doctor+', percentage: '18%', color: 'bg-orange-500' },
            { name: 'AfterMidnight', percentage: '14%', color: 'bg-pink-500' },
          ].map((project, index) => (
            <li key={index} className="flex items-center gap-2 mb-2 last:mb-0">
              <span className="text-gray-400">○</span>
              <span className="text-gray-400">{project.name}</span>
              <span className="ml-auto text-white font-medium">{project.percentage}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
