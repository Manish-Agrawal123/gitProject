import React, { useState } from "react";
import "./Signup.css";
import axios from "axios";
import { Link } from "react-router-dom";

import { useAuth } from "../../AuthContext";

import logo from "../../assets/github.svg";

const Signup = () => {

  const {setUser} = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading,setLoading]  = useState(false);

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
      const res = await axios.post("http://localhost:3000/signup",{
        email:formData.email,
        password:formData.password,
        username:formData.username,
      })
      localStorage.setItem("token",res.data.token);
      localStorage.setItem("userId",res.data.userId);
      setUser(res.data.userId);
      setLoading(false);
      window.location.href = "/";
    }catch(err){
      console.error(err);
      alert("Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">

        <div className="brand">
          <div className="github-logo">
            <img src = {logo} className="logo" alt="gitHubLogo"/>
          </div>
          <h1>Create your account</h1>
        </div>

        <div className="signup-card">
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="username">Username</label>

              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>

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
              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />

              <p className="password-info">
                Password should be at least 8 characters.
              </p>
            </div>

            <button type="submit" disabled={loading} className="signup-btn">
              Create account
            </button>

          </form>
        </div>

        <div className="login-box">
          Already have an account? <Link to = "/login">Signin</Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;