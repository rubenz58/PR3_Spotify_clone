import { useAuth } from "../../contexts/AuthContext";

// XXXXXX >>>>>> –––––– Add styling file –––––– <<<<<< XXXXXX // 


const Navbar = () => {

    const { user, logout } = useAuth();

    return (
        <>
            <h1>Navbar</h1>
            { user && 
                <button onClick={logout} className="logout-button">
              Logout
            </button>
            }
        </>
    );
}

export default Navbar;