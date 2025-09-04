import { ArrowRight } from "lucide-react";
import moment from "moment";
import TransactionInfoCard from "./TransactionInfoCard";

const RecentTransactions = ({ transactions, onMore }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold">Recent Transactions</h4>
        <button
          className="flex items-center gap-1 text-sm text-purple-600 hover:underline"
          onClick={onMore}
        >
          More <ArrowRight size={15} />
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item.id}
            title={item.name}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}

        {/* Empty State */}
        {transactions?.length === 0 && (
          <p className="text-gray-400 text-sm">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
