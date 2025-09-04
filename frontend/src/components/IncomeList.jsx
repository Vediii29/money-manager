import moment from "moment";
import TransactionInfoCard from "./TransactionInfoCard";

const IncomeList = ({transactions, onDelete}) => {
  return(
      <div className ="bg-white p-4 rounded-lg shadow">
        <div className = "flex items-center justify-between">
            <h5 className = "text-lg">Income Sources</h5>
             {/** mail, download */}
        </div>

       <div className="grid grid-cols-1 md:grid-cols-2">
          {/** display the incomes */}
           {transactions?.map((income) => (
             <TransactionInfoCard 
                  key = {income.id}
                  title={income.name}
                  icon={income.icon}
                  date={moment(income.date).format('Do MMM YYYY')}
                  amount={income.amount}
                  type="income"
                  onDelete={() => onDelete(income.id)}
             />
           ))}
       </div>

      </div>
  )
}

export default IncomeList;