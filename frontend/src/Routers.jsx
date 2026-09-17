import React from "react";
import { useState,useEffect } from "react";
import {useNavigate , useRoutes} from 'react-router-dom';

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Files from "./components/dashboard/Files/Files";
import Repositories from "./components/dashboard/Repositories";

import { useAuth } from "./AuthContext";
import CreateRepository from "./components/dashboard/CreateRepository";


const ProjectRoutes = () =>{
    
    const navigate = useNavigate();

    const {User ,setUser} = useAuth();

    useEffect(() => {

        const userIdfromLocal = localStorage.getItem("userId");

        // Load user from localStorage into Context
        if (userIdfromLocal && !User) {
            setUser(userIdfromLocal);
        }

        // User is NOT logged in
        if (
            !userIdfromLocal &&
            !["/login", "/signup"].includes(window.location.pathname)
        ) {
            navigate("/login");
        }

        // User IS logged in
        if (
            userIdfromLocal &&
            ["/login", "/signup"].includes(window.location.pathname)
        ) {
            navigate("/");
        }

    }, [User, setUser, navigate]);

    let elements = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/login",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/files/:repoId",
            element:<Files/> 
        },
        {
            path:"/repo/create",
            element:<CreateRepository/>
        },
        {
            path: "/repositories",
            element: <Repositories />
        },
    ])
    return elements;
}

export default ProjectRoutes;