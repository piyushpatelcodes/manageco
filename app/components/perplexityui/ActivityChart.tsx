import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function ActivityChart() {
  const activityData = [
    { day: 'Mon', percentage: 92 },
    { day: 'Tue', percentage: 41 },
    { day: 'Wed', percentage: 78 },
    { day: 'Thu', percentage: 0 },
    { day: 'Fri', percentage: 0 },
  ];

  const chartData = {
    labels: activityData.map(item => item.day),
    datasets: [
      {
        data: activityData.map(item => item.percentage),
        backgroundColor: activityData.map(item => {
          if (item.percentage >= 70) return '#22c55e'; // green
          if (item.percentage >= 40) return '#eab308'; // yellow
          return '#ef4444'; // red
        }),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 10
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        beginAtZero: true,
        max: 100,
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        display: false
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false
      }
    },
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-white text-lg font-medium">Activity</h3>
        <div className="flex items-center text-green-500">
          <span className="text-sm">+12%</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-white text-4xl font-bold">83%</p>
      </div>
      
      <div className="h-28">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      <div className="grid grid-cols-5 mt-2">
        {activityData.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-gray-400">{item.day}</p>
            <p className="text-xs text-white">{item.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
