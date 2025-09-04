import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Green for Income, Red for Expense
const COLORS = ['#16a34a', '#dc2626'];

const CustomPieChart = ({ data, totalBalance }) => {
    // A safeguard to prevent crashes if data is not an array or is empty
    if (!Array.isArray(data) || data.length === 0 || data.every(item => item.value === 0)) {
        return <p className="text-center text-gray-500">No data to display chart.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // ✅ FIX 1: Add an innerRadius to create the "donut" hole
                    innerRadius={80}
                    outerRadius={110}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                {/* ✅ FIX 2: Add text elements to render in the center of the chart */}
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="central" className="text-sm text-gray-500">
                    Total Balance
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="central" className="text-3xl font-bold text-gray-800">
                    {totalBalance}
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CustomPieChart;

