import { useEffect, useState } from "react";
import CategoryList from "../components/CategoryList.jsx";
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import {Plus} from "lucide-react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal  from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";

const Category = () => {
     useUser();
     const[loading, setLoading] = useState(false);
     const[categoryData, setCategoryData] = useState([]);
     const[openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
     const[openEditCategoryModel, setOpenEditCategoryModel] = useState(false);
     const[selectedCategory, setSelectedCategory] = useState(null);

     const fetchCategoryDetails = async () => {
  if (loading) return;
  setLoading(true);

  try {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);

    console.log("Category API raw response:", response.data);

    const categoryArray = Array.isArray(response.data)
      ? response.data
      : response.data.categories || response.data.data || [];

    setCategoryData(categoryArray);
  } catch (error) {
    console.error("Something went wrong. Please try again.", error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};


     useEffect(()=>{
        fetchCategoryDetails();
     }, []);

     const handleAddCategory = async(category) => {
         const{name, type, icon} = category;

         if(!name.trim()){
            toast.error(" Category name is required");
            return;
         }

         //check if the category already exist
         const isDuplicate = categoryData.some((category) => {
            return category.name.toLowerCase() === name.trim().toLowerCase();
         })

         if(isDuplicate){
            toast.error("Category Name already exists");
            return;
         }


         try{
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {name, type, icon});
            if(response.status === 201){
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                fetchCategoryDetails();
            }
         }catch(error){
            console.error('Error adding category:', error);
            toast.error(error.response?.response?.data?.message || "Failed to add category");
         }
     }
     const handleEditCategory= (categoryToEdit) => {
         setSelectedCategory(categoryToEdit);
         setOpenEditCategoryModel(true);
     }

     const handleUpdateCategory= async(updatedCategory) => {
         const{id, name, type, icon} = updatedCategory;
         if(!name.trim()){
            toast.error("Category Name is required ");
            return;
         }
         
         if(!id){
            toast.error("Category ID is missing for update");
            return;
         }

         try{
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {name, type, icon});
            setOpenEditCategoryModel(false);
            setSelectedCategory(null);
            toast.success("Category updated successfully");
            fetchCategoryDetails();
         }catch(error){
              console.error('Error updating category', error.response?.data?.message || error.message);
              toast.error(error.response?.data?.message || "Failed to update category.");
         }
     }

     return (
        <Dashboard activeMenu = "Category">
                <div className="my-5 mx-auto">
                    {/* add button to add category*/}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold">All Categories </h2>
                       <button 
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-200 transition-colors"
>
                            <Plus size = {15}/>
                            Add Category
                         </button>

                    </div>

                     {/*Category list */}
                     <div className="bg-white p-5 rounded-lg border border-gray-200/70">
                        <CategoryList categories={categoryData} onEditCategory={handleEditCategory}/>
                     </div>

                     {/* Adding category model*/}
                     <Modal
                         isOpen={openAddCategoryModal}
                         onClose={() => setOpenAddCategoryModal(false)}
                         title="Add Category"
                         
                     >
                         <AddCategoryForm onAddCategory = {handleAddCategory}/>
                     </Modal>

                      {/* Updating category model*/}
                      <Modal
                           
                             onClose={() => {
                                setOpenEditCategoryModel(false);
                                setSelectedCategory(null);
                             }} 
                                isOpen= {openEditCategoryModel}
                                 title="Update Category"
                                 >
                          <AddCategoryForm
                             initialCategoryData = {selectedCategory}
                             onAddCategory={handleUpdateCategory}
                             isEditing={true}
                             categoryType={selectedCategory?.type} 
                          
                          />
                      </Modal>
                </div>
       </Dashboard>
    )
}
export default Category;

