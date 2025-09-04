import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import axiosConfig from "../util/axiosConfig.jsx";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
//import IncomeOverview from "../components/IncomeOverview.jsx";
import { Plus } from "lucide-react";


const Income = () => {
    useUser();
    
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);

        if(response.status === 200){
           
            setIncomeData(response.data);
        }
         
       
        
    } catch (error) {
        console.error('Failed to fetch income details:', error);
        toast.error(error.response?.data?.message || "Failed to fetch income details");
    } finally {
        setLoading(false);
    }
};

const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.log('Failed to fetch income categories:', error);
            toast.error(error.response?.data?.message || "Failed to fetch income categories");
        }
    };

    const handleAddIncome = async (income) => {
        const { name, amount, date, icon, categoryId } = income;
        if (!name.trim() || !amount || !date || !categoryId) {
            toast.error("Please fill all required fields.");
            return;
        }
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId,
            });

            // ✅ FIX: This is the optimistic update.
            // It uses the successful response to add the new income to our local list.
            if (response.status === 201 ) {
                setOpenAddIncomeModal(false);
                toast.success("Income added Successfully");
                
                fetchIncomeDetails(); 
                
                // We no longer need to call fetchIncomeDetails() here
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add income");
        }
    };

     const deleteIncome = async (id) => {
       
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income deleted successfully");
            // For deletions, we remove the item from our local state
            fetchIncomeDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete income");
        }
    };

useEffect(() => {
        fetchIncomeCategories();
        fetchIncomeDetails();
        
   
}, []); 

    return(
      <Dashboard activeMenu="Income">
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    {/** category income line chart */}
                    <button 
                            onClick={() => setOpenAddIncomeModal(true)}
                            className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-200 transition-colors"
>
                            <Plus size = {15}/>
                            Add Income
                         </button>
                         
                </div>
                  <IncomeList
                        transactions={incomeData}
                          onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                 />
                 {/** add income modal */}
                  {/* Modals */}
                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <AddIncomeForm
                        onAddIncome={(income) => handleAddIncome(income)}
                        categories={categories}
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </div>
      </Dashboard>
    )
}

export default Income;