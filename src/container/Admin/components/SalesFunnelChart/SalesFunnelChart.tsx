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

/** Phễu chuyển đổi của khách hàng trong tháng gần nhất. */
const FUNNEL_STEPS = [
  { label: "Lượt truy cập", value: 128_940 },
  { label: "Xem sản phẩm", value: 86_320 },
  { label: "Thêm vào giỏ", value: 24_780 },
  { label: "Đặt hàng", value: 11_450 },
];

const SalesFunnelChart = () => {
  const data = {
    labels: FUNNEL_STEPS.map((step) => step.label),
    datasets: [
      {
        label: "Lượt khách hàng",
        data: FUNNEL_STEPS.map((step) => step.value),
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
      <h2 className="text-center text-3xl font-bold mb-6">
        Phễu chuyển đổi bán hàng
      </h2>
      <Bar data={data} options={options} width={1000} height={600} />
    </div>
  );
};

export default SalesFunnelChart;
