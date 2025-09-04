
import {useState, useEffect} from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";
//import AddIncomeForm from "../components/AddIncomeForm.jsx"; 



const AddIncomeForm = ({onAddIncome, categories}) => {
    const[income, setIncome] = useState({
        name:'',
        amount:'',
        date:'',
        icon:'',
        categoryId:''
    })

    const[loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category =>({
        value: category.id,
        label: category.name
    }))

     const handleChange = (key, value) => {
            setIncome({...income,[key]:value});
  }

  const handleAddIncome = async() => {
    setLoading(true);
    try{
        await onAddIncome(income)
    }finally{
        setLoading(false);
    }
}

useEffect(() => {
    if(categories.length > 0 && !income.categoryId){
        setIncome((prev) => ({...prev, categoryId: categories[0].id}))
    }
}, [categories, income.categoryId]);


  return(
      <div>
        <EmojiPickerPopup
           icon={income.icon}
           onSelect={(selectedIcon)=>handleChange('icon', selectedIcon)}
        
        />
              <Input
               value={income.name}
               onChange={({target}) => handleChange('name', target.value)}
                label = "Income Source"
                placeholder = "e.g., Freelance, Salary, Bonus"
                type = "text"
            />
            <Input
                label = "Category"
                value= {income.categoryId}
                onChange={({target}) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
             />

             <Input
                value= {income.amount}
                onChange={({target}) => handleChange('amount', target.value)}
                type="number"
                label="Amount"
                placeholder="e.g. , 500.00"
             />

            <Input
                value= {income.date}
                onChange={({target}) => handleChange('date', target.value)}
                type="date"
                label="Date"
                placeholder=""
             />
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => onAddIncome(income)}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  {loading ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin"/>
                       Adding...
                    </>
                  ) : (
                    <>
                      Add Income
                    </>
                  )}

                </button>

             </div>
      </div>
  )
}

export default AddIncomeForm;