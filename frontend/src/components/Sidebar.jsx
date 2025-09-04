import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { SIDE_BAR_DATA } from "../assets/assets.js";

const Sidebar = () => {
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20 flex flex-col">
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center gap-3 mt-3 mb-7">
                {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="profile" className="w-20 h-20 rounded-full object-cover"/>
                ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full">
                        <User className="w-10 h-10 text-purple-500"/>
                    </div>
                )}
                {/* Use optional chaining to prevent the crash */}
                <p className="text-lg font-semibold text-gray-800">{user?.fullName}</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 flex-grow">
                {SIDE_BAR_DATA.map((item) => {
                    // Assign the icon to a capitalized variable
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 py-2 px-4 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-purple-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="mt-auto">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
