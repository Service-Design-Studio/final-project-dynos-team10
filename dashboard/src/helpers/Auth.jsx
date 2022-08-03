import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../router";

export default function Auth({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    // if (!isAuthenticated && import.meta.env.MODE !== "development") {
    //     return <Navigate to="/login" state={{ from: location }} replace />
    // }
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children;
}