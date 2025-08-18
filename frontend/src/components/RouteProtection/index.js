import { Navigate } from "react-router-dom";

import useStore from "../../stores/useStore";


export const PublicRoute = ({ children }) => {
    const { user } = useStore();

    return user ? <Navigate to="/dashboard" replace/> : children;
}


export const ProtectedRoute = ({ children }) => {
    const { user } = useStore();

    return user ? children : <Navigate to="/login" replace/>;
}
