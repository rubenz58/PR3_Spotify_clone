import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

// XXXXXX >>>>>> –––––– Add styling file –––––– <<<<<< XXXXXX // 


const Navbar = () => {

    const { userIsLoaded } = useAuth();

    return (
        <h1>Navbar</h1>
    );
}

export default Navbar;