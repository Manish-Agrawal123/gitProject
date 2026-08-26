import React, { useEffect, useState } from "react";
import "./Login.css";
import {Link} from "react-router-dom";
import axios from "axios";

import logo from "../../assets/github.svg";

import { useAuth } from "../../AuthContext";

const Login = () => {

    const {User,setUser}  = useAuth();

    useEffect(()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
    },[]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading,setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await axios.post("http://localhost:3000/login",{
        email:formData.email,
        password:formData.password,
      })
      localStorage.setItem("token",res.data.token);
      localStorage.setItem("userId",res.data.userId);
      setUser(res.data.userId);
      setLoading(false);
      window.location.href = "/";
    }catch(err){
      console.error(err);
      alert("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* Logo + Heading */}
        <div className="brand">
          <img
            src={logo}
            className="github-logo"
            alt="GitHub"
          />

          <h1>Sign in to your account</h1>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <form onSubmit={handleSubmit}>

            {/* Email */}
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

            {/* Password */}
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

            {/* Button */}
            <button
              type="submit"
              className="login-btn"
              disabled = {loading}
            >
              Sign in
            </button>

          </form>
        </div>

        {/* Signup */}
        <div className="signup-box">
          Don't have an account?{" "}
          <Link to = "/signup">Create an account</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;