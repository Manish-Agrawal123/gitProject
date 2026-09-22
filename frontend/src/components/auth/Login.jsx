import React, { useEffect, useState } from "react";
import "./Login.css";

import { Link } from "react-router-dom";

import api from "../../axios.js";

import logo from "../../assets/github.svg";

import { useAuth } from "../../AuthContext";

const Login = () => {
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await api.post(
                "/login",
                {
                    email: formData.email,
                    password: formData.password,
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "userId",
                response.data.userId
            );

            setUser(response.data.userId);

            window.location.href = "/";
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">

                <div className="brand">
                    <img
                        src={logo}
                        className="github-logo"
                        alt="GitHub"
                    />

                    <h1>
                        Sign in to your account
                    </h1>
                </div>

                <div className="login-card">
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-label">
                                <label htmlFor="password">
                                    Password
                                </label>
                            </div>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>
                </div>

                <div className="signup-box">
                    Don't have an account?{" "}
                    <Link to="/signup">
                        Create an account
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;