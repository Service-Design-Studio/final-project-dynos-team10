import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export function RequireAuth({ children }) {
    let location = useLocation();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        console.log({isAuthenticated});
    }, [isAuthenticated])
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children;
}