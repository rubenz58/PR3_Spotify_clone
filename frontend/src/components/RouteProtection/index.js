import { Navigate } from "react-router-dom";

import useStore from "../../stores/useStore";


export const PublicRoute = ({ children }) => {
    const { user } = useStore();
    console.log("\nPUBLIC ROUTE");
    console.log("USER?: ", user);
    console.log("CHILDREN:");

    // Get component name(s)
    if (children) {
        if (Array.isArray(children)) {
            console.log("CHILDREN COMPONENTS:", children.map(child => 
                child?.type?.name || child?.type?.displayName || child?.type || 'Unknown'
            ));
        } else {
            console.log("CHILD COMPONENT:", children?.type?.name || children?.type?.displayName || children?.type || 'Unknown');
        }
    }

    return user ? <Navigate to="/spotify" replace/> : children;
}


export const ProtectedRoute = ({ children }) => {
    const { user } = useStore();

    console.log("\nPROTECTED ROUTE");
    console.log("USER?: ", user);
    console.log("CHILDREN:");

    // Get component name(s)
    if (children) {
        if (Array.isArray(children)) {
            console.log("CHILDREN COMPONENTS:", children.map(child => 
                child?.type?.name || child?.type?.displayName || child?.type || 'Unknown'
            ));
        } else {
            console.log("CHILD COMPONENT:", children?.type?.name || children?.type?.displayName || children?.type || 'Unknown');
        }
    }

    return user ? children : <Navigate to="/login" replace/>;
}
