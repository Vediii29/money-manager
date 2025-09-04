import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import Dashboard from "../components/Dashboard.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { addThousandsSeparator } from "../util/util.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import RecentTransactions from "../components/RecentTransactions.jsx";
import FinanceOverview from "../components/FinanceOverview.jsx";
import Transactions from "../components/Transactions.jsx";

const Home = () => {
  useUser();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error(
        "Something went wrong while fetching dashboard data:",
        error
      );
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="my-5 mx-auto max-w-7xl px-4">
        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<Wallet />}
            label="Total Balance"
            value={`₹${addThousandsSeparator(
              dashboardData?.totalBalance || 0
            )}`}
            color="bg-purple-600"
          />
          <InfoCard
            icon={<TrendingUp />}
            label="Total Income"
            value={`₹${addThousandsSeparator(
              dashboardData?.totalIncome || 0
            )}`}
            color="bg-green-600"
          />
          <InfoCard
            icon={<TrendingDown />}
            label="Total Expense"
            value={`₹${addThousandsSeparator(
              dashboardData?.totalExpense || 0
            )}`}
            color="bg-red-600"
          />
        </div>

        {/* Main content area grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Recent Transactions (takes 2/3 of the space on large screens) */}
          <div className="lg:col-span-2">
            <RecentTransactions
              transactions={dashboardData?.recentTransactions || []}
              onMore={() => navigate("/filter")}
            />
          </div>

          {/* Finance Overview (takes 1/3 of the space on large screens) */}
          <div className="lg:col-span-1">
             <FinanceOverview dashboardData={dashboardData} loading={loading} />
          </div>
        </div>

        {/* ✅ FIX: Added a new grid for the bottom two sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Incomes */}
            <Transactions
             title="Recent Incomes" 
             transactions={dashboardData?.recent5Incomes || []}
             onMore={() => navigate("/income")}
             type="income"
            />
            {/* Recent Expenses */}
            <Transactions
             title="Recent Expenses" 
             transactions={dashboardData?.recent5Expenses || []}
             onMore={() => navigate("/expense")}
             type="expense"
            />
        </div>
      </div>
    </Dashboard>
  );
};

export default Home;

