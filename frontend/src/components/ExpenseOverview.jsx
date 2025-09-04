import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import moment from "moment";

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // This useEffect now ONLY handles processing the transaction data.
  // It no longer depends on the chart ref.
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData({ labels: [], datasets: [] }); // Clear chart if no transactions
      return;
    }

    const dailyData = {};
    // Sort transactions by date to ensure the chart is in chronological order
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTransactions.forEach(transaction => {
        const day = moment(transaction.date).format('D MMM');
        if (dailyData[day]) {
            dailyData[day] += transaction.amount;
        } else {
            dailyData[day] = transaction.amount;
        }
    });

    setChartData({
        labels: Object.keys(dailyData),
        datasets: [{
            label: 'Expense',
            data: Object.values(dailyData),
            fill: true,
            borderColor: 'rgb(239, 68, 68)',
            pointBackgroundColor: 'rgb(239, 68, 68)',
            tension: 0.4,
            pointRadius: 5,
            // The gradient is applied below
            backgroundColor: 'transparent', 
        }],
    });
  }, [transactions]); // This effect runs only when transactions change

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } } }
  };

  // We create a custom plugin to apply the gradient after the chart is drawn
  const gradientPlugin = {
    id: 'gradientPlugin',
    beforeDraw: (chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) {
        return;
      }
      // Only apply to datasets that want it
      chart.data.datasets.forEach((dataset, i) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.5)');
        dataset.backgroundColor = gradient;
      });
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <div>
            <h5 className="text-lg font-medium text-gray-800">Expense Overview</h5>
            <p className="text-xs text-gray-400 mt-1">
              Track your spending trends over time.
            </p>
        </div>
        <button 
            onClick={onAddExpense}
            className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-200 transition-colors"
        >
            <Plus size={15} /> Add Expense
        </button>
      </div>
      <div className="mt-10 h-72">
        {transactions && transactions.length > 0 ? (
          <Line options={options} data={chartData} plugins={[gradientPlugin]} />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            No expense data to display chart.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;