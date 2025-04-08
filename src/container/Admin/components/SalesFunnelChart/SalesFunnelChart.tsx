import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesFunnelChart = () => {
  const data = {
    labels: ["All sessions", "Product views", "Add to cart", "Checkout"],
    datasets: [
      {
        label: "Users",
        data: [289120, 184640, 156300, 65800],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 bg-white rounded-sm p-4">
      <h2 className="text-center text-3xl font-bold mb-6">Sales Funnel</h2>
      <Bar data={data} options={options} width={1000} height={600} />
    </div>
  );
};

export default SalesFunnelChart;
