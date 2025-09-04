import { addThousandsSeparator } from "../util/util.js";
import CustomPieChart from './CustomPieChart.jsx';

const FinanceOverview = ({ dashboardData, loading }) => {
    // ✅ FIX: Prepare data with only income and expense for the chart segments
    const chartData = [
        { name: "Total Income", value: dashboardData?.totalIncome || 0 },
        { name: "Total Expense", value: dashboardData?.totalExpense || 0 },
    ];
    
    const totalBalance = dashboardData?.totalBalance || 0;

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h4>
            
            <div style={{ width: '100%', height: 300 }}>
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Loading Chart...</p>
                    </div>
                ) : (
                    <CustomPieChart
                        data={chartData}
                        // Pass the total balance as a separate prop
                        totalBalance={`₹${addThousandsSeparator(totalBalance)}`}
                    />
                )}
            </div>
        </div>
    );
};

export default FinanceOverview;

