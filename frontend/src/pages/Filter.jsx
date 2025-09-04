import { useState } from "react";
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Search } from "lucide-react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import { toast } from "react-hot-toast";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx";
import moment from "moment";

const Filter = () => {
  useUser();
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      type,
      keyword,
      sortField,
      sortOrder,
    };

    if (startDate) {
      payload.startDate = startDate;
    }
    if (endDate) {
      payload.endDate = endDate;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, payload);
      let data = Array.isArray(response.data) ? response.data : [];

      // ✅ FIX: Add the correct 'type' to each transaction object when it's fetched.
      // This prevents the color from changing incorrectly when the dropdown changes.
      if (type === 'income' || type === 'expenses') {
        const transactionType = type === 'income' ? 'income' : 'expense';
        data = data.map(transaction => ({ ...transaction, type: transactionType }));
      }

      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions: ", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch transactions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard activeMenu="Filters">
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Filter Transactions</h2>
        </div>

        {/* Filter Selection Card */}
        <div className="card p-4 mb-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-semibold">Select the filters</h5>
          </div>

          <form
            className="mt-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4"
            onSubmit={handleSearch}
          >
            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="type">
                Type
              </label>
              <select
                value={type}
                id="type"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expenses">Expense</option>
              </select>
            </div>
            {/* Other form inputs... */}
            <div>
              <label htmlFor="startdate" className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                value={startDate}
                id="startdate"
                type="date"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="enddate" className="block text-sm font-medium mb-1">
                End Date
              </label>
              <input
                value={endDate}
                id="enddate"
                type="date"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sortfield" className="block text-sm font-medium mb-1">
                Sort Field
              </label>
              <select
                value={sortField}
                id="sortfield"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortorder" className="block text-sm font-medium mb-1">
                Sort Order
              </label>
              <select
                value={sortOrder}
                id="sortorder"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium mb-1">
                Search
              </label>
              <div className="flex">
                <input
                  value={keyword}
                  id="keyword"
                  type="text"
                  placeholder="Search..."
                  className="w-full border rounded-l-md px-3 py-2"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 bg-purple-800 hover:bg-purple-900 text-white rounded-r-md flex items-center justify-center cursor-pointer"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Transactions Section */}
        <div className="card p-4 mb-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-2xl font-semibold">Transactions</h5>
          </div>
          {transactions.length === 0 && !loading && (
            <p className="text-gray-500">
              Select the filters and click apply to filter the transactions
            </p>
          )}
          {loading && (
            <p className="text-gray-500">Loading Transactions...</p>
          )}
          {transactions.map((transaction) => (
              <TransactionInfoCard
                key={transaction.id}
                title={transaction.name}
                icon={transaction.icon}
                date={moment(transaction.date).format("Do MMM YYYY")}
                amount={transaction.amount}
                type={transaction.type} 
                hideDeleteBtn
              />
            )
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default Filter;

