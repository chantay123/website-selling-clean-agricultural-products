import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoriesChart = () => {
  const data = {
    labels: ["Fashion", "Electronics", "Food"],
    datasets: [
      {
        data: [80.02, 24.53, 16.47], // Percentage values
        backgroundColor: ["#10B981", "#FBBF24", "#FB923C"], // Colors for each category
        hoverBackgroundColor: ["#10B981", "#FBBF24", "#FB923C"],
        borderWidth: 0, // No border
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
          Top categories
        </div>
        <div className="flex justify-center items-center mb-6">
          <div className="relative w-60 h-60">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <div className="text-2xl font-bold text-green-600">24,329,7</div>

              <div className="text-sm text-gray-500">Total Sales</div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              <div className="text-gray-800">Fashion</div>
            </div>
            <div className="text-gray-600">80.02%</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
              <div className="text-gray-800">Electronics</div>
            </div>
            <div className="text-gray-600">24.53%</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
              <div className="text-gray-800">Food</div>
            </div>
            <div className="text-gray-600">16.47%</div>
          </div>
        </div>
        <div className="text-blue-600 mt-4 cursor-pointer">View details</div>
      </div>

      {/* Next Upcoming Event Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-lg font-semibold text-gray-800 mb-4">
          Next Upcoming Event
        </div>
        <div className="flex justify-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWJMLBfAojLdatALIrsS7t0W98JA443oUWSw&s"
            alt="Upcoming Event"
            className="h-48 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoriesChart;
