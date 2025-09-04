// DebugComponent.jsx (temporary)
import { useEffect } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import axiosConfig from "../util/axiosConfig.jsx";

const DebugComponent = () => {
    useEffect(() => {
        const testConnection = async () => {
            try {
                console.log("Testing connection to:", API_ENDPOINTS.GET_ALL_EXPENSES);
                const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
                console.log("Connection successful:", response);
            } catch (error) {
                console.error("Connection failed:", error);
                console.log("Error details:", error.response);
            }
        };
        
        testConnection();
    }, []);

    return <div style={{display: 'none'}}>Debug Component</div>;
};

export default DebugComponent;