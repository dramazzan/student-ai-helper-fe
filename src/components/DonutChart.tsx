'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { useEffect, useRef } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  average: number;
  testsTaken: number;
}

const DonutChart = ({ average, testsTaken }: DonutChartProps) => {
  const data: ChartData<'doughnut'> = {
    labels: ['Средний балл', 'Остальное'],
    datasets: [
      {
        data: [average, 100 - average],
        backgroundColor: ['#4ade80', '#e5e7eb'], // зеленый и серый
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  // Центр текста
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as any;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(`${testsTaken} тест`, canvas.width / 2, canvas.height / 2);
  }, [testsTaken]);

  return (
    <div className="relative w-60 h-60 mx-auto">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">{testsTaken} тест</p>
          <p className="text-sm text-gray-500">{average}% средний балл</p>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
