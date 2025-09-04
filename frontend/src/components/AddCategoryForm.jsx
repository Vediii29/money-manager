import { LoaderCircle } from "lucide-react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { useEffect, useState } from "react";

const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing }) => {
    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        } else {
            setCategory({ name: "", type: "income", icon: "" });
        }
    }, [isEditing, initialCategoryData]);

    const categoryTypeOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" },
    ];

    const handleChange = (key, value) => {
        setCategory({ ...category, [key]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddCategory(category);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIX: Determine button color based on the category's type
    const buttonColorClasses = category.type === 'income'
        ? 'bg-green-600 hover:bg-green-700'   // Green for income
        : 'bg-purple-600 hover:bg-purple-700'; // Purple for expense

    return (
        <div className="p-4">
            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(icon) => handleChange("icon", icon)}
            />

            <Input
                value={category.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, salary, Groceries"
                type="text"
            />

            <Input
                label="Category Type"
                value={category.type}
                onChange={({ target }) => handleChange('type', target.value)}
                isSelect={true}
                options={categoryTypeOptions}
            />
            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    // ✅ FIX: Apply the dynamic color classes to the button
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${buttonColorClasses}`}
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                            {isEditing ? "Update Category" : "Add Category"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddCategoryForm;