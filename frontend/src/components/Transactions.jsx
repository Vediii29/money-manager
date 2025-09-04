import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

// ✅ FIX: Use curly braces { } to correctly receive props from the props object
const Transactions = ({ title, transactions, onMore, type }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                {/* Now the 'title' prop is correctly received and can be used */}
                <h4 className="text-lg font-bold text-gray-800">{title}</h4>
                <button
                    className="flex items-center gap-1 text-sm text-purple-600 font-semibold hover:underline"
                    onClick={onMore}
                >
                    More <ArrowRight size={15} />
                </button>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
                {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.slice(0, 5).map((item) => (
                        <TransactionInfoCard
                            key={item.id}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={type} // Pass the type for correct color coding
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <p className="text-gray-400 text-sm mt-4">No transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default Transactions;

