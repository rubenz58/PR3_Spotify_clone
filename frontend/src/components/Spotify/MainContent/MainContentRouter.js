import { useLocation } from "react-router-dom";

import { MainContent } from "./";
import LoginForm from "../../Authentication/LoginForm/LoginForm";
import SignupForm from "../../Authentication/SignUpForm/SignUpForm";
import Admin from "../../Authentication/Admin";

export const MainContentRouter = ({ view }) => {

    console.log("MainContentRouter");

    // Handling the different cases for routing here.
    const location = useLocation();

    if (location.pathname === '/login') {
        return <LoginForm />;
    }
    
    if (location.pathname === '/signup') {
        return <SignupForm />;
    }
    
    if (location.pathname === '/admin') {
        return <Admin />;
    }
    
    return <MainContent />;
    
}

export default MainContentRouter;