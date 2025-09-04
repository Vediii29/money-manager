import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories }) => {
     console.log('--- STEP 3: CATEGORIES RECEIVED AS PROPS ---', categories);
    const [expense, setExpense] = useState({
        name: '', amount: '', date: '', icon: '', categoryId: ''
    });
    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }));

    const handleChange = (key, value) => {
        setExpense({ ...expense, [key]: value });
    };

    const handleAddClick = async () => {
        setLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setLoading(false);
        }
    };

    // This hook automatically selects the first category as the default
    useEffect(() => {
        if (categories.length > 0 && !expense.categoryId) {
            setExpense((prev) => ({ ...prev, categoryId: categories[0].id }));
        }
    }, [categories, expense.categoryId]);

    return (
        <div className="p-4">
            <EmojiPickerPopup
              icon={expense.icon}
              onSelect={(icon) => handleChange('icon', icon)}
            />
            <Input
               value={expense.name}
               onChange={({ target }) => handleChange('name', target.value)}
               label="Expense Name"
               placeholder="e.g., Uber, Lunch, Shopping"
               type="text"
            />
            <Input
                label="Category"
                value={expense.categoryId}
                onChange={({ target }) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
            />
            <Input
                value={expense.amount}
                onChange={({ target }) => handleChange('amount', target.value)}
                type="number"
                label="Amount"
                placeholder="e.g., 500.00"
            />
            <Input
                value={expense.date}
                onChange={({ target }) => handleChange('date', target.value)}
                type="date"
                label="Date"
            />
            <div className="flex justify-end mt-6">
                <button
                  onClick={handleAddClick}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin"/> Adding...
                    </>
                  ) : "Add Expense"}
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;