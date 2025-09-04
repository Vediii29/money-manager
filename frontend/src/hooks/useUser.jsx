import { useContext, useEffect } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";

export const useUser = () => {
    const { user, setUser, clearuser } = useContext(AppContext);
    const navigate = useNavigate();

    // Create a safe clearUser function in case it's not provided by context
    const safeClearUser = () => {
        if (typeof clearuser === 'function') {
            clearuser();
        } else {
            // Fallback: manually clear user data
            localStorage.removeItem('token');
            if (typeof setUser === 'function') {
                setUser(null);
            }
        }
    };

    useEffect(() => {
        if (user) {
            return;
        }
        
        let isMounted = true;
        const fetchUserInfo = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
                if (isMounted && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log("Failed to fetch the user info", error);
                if (isMounted) {
                    safeClearUser(); // Use the safe function
                    navigate("/login");
                }
            }
        };
        
        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [user, setUser, navigate]); // Remove clearuser from dependencies

    return user;
};