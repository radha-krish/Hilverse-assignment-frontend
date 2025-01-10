import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../utils/backend";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("e", email);
    const response = await fetch(API_URLS.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
    if (data.success && data.logined.role === "Manager") {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else if (data.logined.role === "PantryStaff") {
      localStorage.setItem("token", data.token);
      navigate("/pantrystaffdashboard");
    } 
    else if (data.logined.role === "Delivery") {
      localStorage.setItem("token", data.token);
      navigate("/deliverydashboard");}
  else {
      alert("Invalid credentials or insufficient permissions.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <a href="/signup" className="text-teal-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
