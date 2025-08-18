import useStore from "../../stores/useStore";

import './Navbar.css';


const Navbar = () => {

    const { user, logout } = useStore();

    return (
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