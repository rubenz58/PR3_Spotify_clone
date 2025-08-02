import { useAuth } from "../../contexts/AuthContext";

import './Navbar.css';

// XXXXXX >>>>>> –––––– Add styling file –––––– <<<<<< XXXXXX // 


const Navbar = () => {

    const { user, logout } = useAuth();

    return (
        // <>
        //     <h1>Navbar</h1>
        //     { user && 
        //         <button onClick={logout} className="logout-button">
        //       Logout
        //     </button>
        //     }
        // </>
        <nav className="navbar">
            <h1 className="navbar-title">MyAuthApp</h1>
            
            {user ? (
                <div className="navbar-user">
                <span className="navbar-user-welcome">
                    Welcome, <span className="navbar-user-name">{user.name}</span>!
                </span>
                <button onClick={logout} className="navbar-logout-btn">
                    Logout
                </button>
                </div>
            ) : (
                <div className="navbar-empty"></div>
            )}
        </nav>
    );
}

export default Navbar;