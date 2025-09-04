import { useState, useEffect } from "react"; 
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import Dashboard from "../components/Dashboard.jsx";
import Modal from "../components/Modal.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import axiosConfig from "../util/axiosConfig.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DebugComponent from "../components/DebugComponent.jsx";

const Expense = () => {
       const user = useUser();
        console.log('--- CHECKING USER OBJECT ---', user); 
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const fetchExpenseDetails = async () => {
        if (loading) return; 
        
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            setExpenseData(response.data.expenses || []);
            
            if (response.status === 200) {
                  setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Expense fetch error:", error); 
            toast.error(error.response?.data?.message || "Failed to fetch expenses");  
        } finally {
            setLoading(false);
        }
    };

    // This is the corrected version
const fetchExpenseCategories = async () => {
    try {
        const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
        console.log('--- STEP 1: RAW API RESPONSE ---', response.data);
        // FIX: This correctly gets the array from the API response
        const categoryArray = Array.isArray(response.data) ? response.data : (response.data.categories || []);
        
        setCategories(categoryArray);

    } catch (error) {
        console.error("Category fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to fetch expense categories");
    }
};

    const handleAddExpense = async (expense) => {
        const { name, amount, date, icon, categoryId } = expense;

        if (!name.trim()) {
            toast.error("Please enter a name");
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0");
            return;
        }
        if (!date) {
            toast.error("Please select a date");
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error("Date cannot be in the future");
            return;
        }
        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId,
            });
            
            if (response.status === 201) {
                setOpenAddExpenseModal(false);
                toast.success("Expense added successfully");
                fetchExpenseDetails();
            }
        } catch (error) {
            
            toast.error(error.response?.data?.message || "Failed to add expense");
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            
            toast.error(error.response?.data?.message || "Failed to delete expense");
        }
    };

    useEffect(() => {
    // Only run if the user object exists
    if (user) {
        fetchExpenseDetails();
        fetchExpenseCategories();
    }
}, [user]); // Re-run when the user object changes
    
console.log('--- STEP 2: CATEGORIES IN STATE ---', categories); 
        return(
      <Dashboard activeMenu="Expense">
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    {/** category income line chart */}
                    <button 
                            onClick={() => setOpenAddExpenseModal(true)}
                            className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-200 transition-colors"
>
                            <Plus size = {15}/>
                            Add Expense
                         </button>
                         
                </div>
                  <ExpenseList
                        transactions={expenseData}
                          onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                 />
                 {/** add income modal */}
                  {/* Modals */}
                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={() => setOpenAddExpenseModal(false)}
                    title="Add Expense"
                >
                    <AddExpenseForm
                        onAddExpense={(expense) => handleAddExpense(expense)}
                        categories={categories}
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income?"
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </div>
      </Dashboard>
    )
};

export default Expense;
