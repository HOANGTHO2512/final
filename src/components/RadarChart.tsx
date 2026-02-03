'use client';

import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  labels: string[];
  data: number[];
  maxValue?: number;
}

export default function RadarChart({ labels, data, maxValue = 100 }: RadarChartProps) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: '能力分佈',
        data: data,
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.16)',
        borderColor: '#2563eb',
        pointBackgroundColor: '#2563eb',
        borderWidth: 2,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: maxValue,
        grid: {
          color: '#eef6ff',
        },
        angleLines: {
          color: '#eef6ff',
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="h-56 w-full">
      <Radar data={chartData} options={options} />
    </div>
  );
}
