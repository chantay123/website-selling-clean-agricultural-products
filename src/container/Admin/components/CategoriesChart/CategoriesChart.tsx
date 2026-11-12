import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

/** Doanh thu theo từng nhóm nông sản của tháng gần nhất. */
const CATEGORY_SALES = [
  { name: "Trái cây tươi", value: 42.8, color: "#10B981" },
  { name: "Rau củ hữu cơ", value: 26.4, color: "#FBBF24" },
  { name: "Thịt & Thủy hải sản", value: 18.1, color: "#FB923C" },
  { name: "Nông sản sạch", value: 12.7, color: "#60A5FA" },
];

const TOTAL_SALES = 486_250_000;

const formatVND = (value: number) => `${value.toLocaleString("vi-VN")} đ`;

const CategoriesChart = () => {
  const data = {
    labels: CATEGORY_SALES.map((item) => item.name),
    datasets: [
      {
        data: CATEGORY_SALES.map((item) => item.value),
        backgroundColor: CATEGORY_SALES.map((item) => item.color),
        hoverBackgroundColor: CATEGORY_SALES.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%", // Creates the "donut" effect
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
    },
  };

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-lg font-semibold text-gray-800 mb-4">
          Nhóm nông sản bán chạy nhất
        </div>
        <div className="flex justify-center items-center mb-6">
          <div className="relative w-60 h-60">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <div className="text-2xl font-bold text-green-600">
                {formatVND(TOTAL_SALES)}
              </div>
              <div className="text-sm text-gray-500">Tổng doanh thu</div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {CATEGORY_SALES.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-center mt-2 first:mt-0"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="text-gray-800">{item.name}</div>
              </div>
              <div className="text-gray-600">{item.value.toFixed(2)}%</div>
            </div>
          ))}
        </div>
        <div className="text-blue-600 mt-4 cursor-pointer">
          Xem chi tiết báo cáo
        </div>
      </div>

      {/* Sự kiện sắp tới */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-lg font-semibold text-gray-800 mb-4">
          Sự kiện sắp tới
        </div>
        <div className="bg-green-50 rounded-lg p-5 border border-green-100">
          <div className="text-green-700 font-semibold">
            Ngày hội nông sản sạch Đà Lạt 2026
          </div>
          <div className="text-sm text-gray-600 mt-1">
            20/12/2026 · Trung tâm Hội chợ Đà Lạt
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Giới thiệu 120 sản phẩm đạt chuẩn VietGAP đến từ các hợp tác xã
            tại Lâm Đồng, Đắk Lắk và Tây Nguyên.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesChart;
