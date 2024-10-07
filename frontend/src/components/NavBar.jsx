import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import "../navbar.css";

const NavBar = () => {
    const { auth } = useContext(AuthContext); // Get auth context
    let endPoints = [];

    if (auth) {
        switch (auth.user) {
            case 'tourist':
                endPoints = [
                    ["Log out","/logout"],
                    ["My Account", "/touristAccount"],
                    ["Itineraries", "/touristItineraries"],
                    ["Activities", "/activities"],
                    ["Museums", "/museums"],
                    ["All", "/viewAll"]
                ];
                break;
            case 'user':
                console.log("Regular user");
                break;
            case 'guest':
                console.log("Guest user");
                break;
            default:
                endPoints = [
                    ["Register", "/register"],
                    ["Itineraries", "/touristItineraries"],
                    ["Activities", "/activities"],
                    ["Museums", "/museums"],
                    ["All", "/viewAll"]
                ];
        }
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    Rahhala
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
                        {endPoints.map(([name, path], index) => (
                            <li className="nav-item" key={index}>
                                <a className="nav-link" href={path}>
                                    {name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;