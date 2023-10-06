import { NavLink } from "react-router-dom";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

import "../CSS/navbar.css";

const Navbar = ()=>{

    const navigate = useNavigate();
    /* The `useEffect` hook is used to perform side effects in functional components. In this case, it
    is being used to check if a user is logged in. */
    useEffect(()=>{
        let user = sessionStorage.getItem("user");
        if(!user)
        {
            navigate("/login");
        }

    },[])
    return(
        <>
            <div className="nav-container">
                <div className="logo">
                    <h1><NavLink to="/">Naya Games</NavLink></h1>
                    {/* <h1 className="hamburger">☰</h1> */}
                </div>
                <div className="all-games-link">
                    <ul>
                        <li><NavLink to="/tik-tak-toe">Tik Tak Toe</NavLink></li>
                        <li><NavLink to="/snake-and-ladder">Snake And Ladder</NavLink></li>
                    </ul>
                </div>
            </div>
        </>
    )
};

export default Navbar;