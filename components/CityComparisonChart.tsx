// components/CityComparisonChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CityComparisonChartProps {
  cities: {
    name: string;
    average_salary: number;
    average_rent: number;
    quality_of_life_index: number;
  }[];
}

const CityComparisonChart: React.FC<CityComparisonChartProps> = ({ cities }) => {
  const labels = cities.map((city) => city.name);

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Salary',
        data: cities.map((city) => city.average_salary),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Average Rent',
        data: cities.map((city) => city.average_rent),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Quality of Life Index',
        data: cities.map((city) => city.quality_of_life_index),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'City Comparison Metrics',
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CityComparisonChart;
