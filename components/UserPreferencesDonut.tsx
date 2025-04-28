"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

interface UserPreferencesDonutProps {
  data: { [key: string]: number };
}
// UserPreferencesDonut.tsx
const UserPreferencesDonut = ({ data }: UserPreferencesDonutProps) => {
  const labels = Object.keys(data);
  const counts = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default UserPreferencesDonut;
