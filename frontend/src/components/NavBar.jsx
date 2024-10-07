import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import "../navbar.css";
const NavBar = () => {
    const { auth } = useContext(AuthContext); // Get auth context
    console.log(auth)
    // auth.token=null
    // auth.isAuthenticated=false
    // auth.loading=true
    if(!auth.isAuthenticated){
        console.log("Guest")
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">
            Navbar
            </a>
            <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                    Home
                </a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="#">
                    Features
                </a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="#">
                    Pricing
                </a>
                </li>
                <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">
                    Disabled
                </a>
                </li>
            </ul>
            </div>
        </div>
        </nav>
    )
}

export default NavBar