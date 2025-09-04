import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const ExpenseList = ({ transactions, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium text-gray-800">All Expenses</h5>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
            {transactions?.map((expense) => (
                <TransactionInfoCard
                  key={expense.id}
                  title={expense.name}
                  icon={expense.icon}
                  date={moment(expense.date).format('Do MMM YYYY')}
                  amount={expense.amount}
                  type="expense" // Set type to 'expense'
                  onDelete={() => onDelete(expense.id)}
                />
            ))}
      </div>
    </div>
  );
};
export default ExpenseList;