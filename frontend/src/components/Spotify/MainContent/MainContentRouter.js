import { Navigate, useLocation } from "react-router-dom";

import { MainContent } from "./";
import LoginForm from "../../Authentication/LoginForm/LoginForm";
import SignupForm from "../../Authentication/SignUpForm/SignUpForm";
import useStore from "../../../stores/useStore";

export const MainContentRouter = ({ view }) => {

    console.log("MainContentRouter");

    // Handling the different cases for routing here.
    const { user } = useStore();
    const location = useLocation();
    
    // Determine view from prop or URL
    const currentView = view || (location.pathname === '/signup' ? 'signup' : 'login');
    // const currentView = location.pathname === '/signup' ? 'signup' 
    //                 : location.pathname === '/login' ? 'login' 
    //                 : null; // When at "/", don't show auth forms
    console.log("current view: ", currentView);

    if (currentView === 'login') {
        if (!user) {
            return <LoginForm/>;
        } else {
            // User already logged in -> Go to Content
            return <MainContent/>;
            // console.log("Navigate to /");
            // return <Navigate to="/" replace />;
        }
    }

    if (currentView === 'signup') {
        if (!user) {
            return <SignupForm/>;
        } else {
            // User already logged in -> Go to Content
            return <MainContent/>;
            // return <Navigate to="/" replace />;
        }
    }
    
    return <MainContent/>;

}

export default MainContentRouter;