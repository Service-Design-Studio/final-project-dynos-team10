import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "../store/auth/authSlice";

export function RequireAuth({ children }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    let location = useLocation();
    // if (!isAuthenticated && process.env.NODE_ENV !== "development") {
    //     return <Navigate to="/login" state={{ from: location }} replace />
    // }
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children;
}