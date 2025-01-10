import React, { useState } from "react";
import { API_URLS } from "../../utils/backend";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    contactInfo: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Prepare the headers with Authorization
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // Include Bearer token if available
    };

    try {
      const response = await fetch(API_URLS.addPantry, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User registered:", result);
        // Optionally, navigate to another page or show success message
        window.location.reload();
      } else {
        const result = await response.json();
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto md:min-w-96 bg-white p-6 rounded-lg shadow-md sm:max-w-md md:max-w-lg lg:max-w-xl">
      <h2 className="text-2xl font-semibold text-teal-800 mb-6">User Registration</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-600">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
        </div>

        {/* Role Field */}
        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-gray-600">
            Role
          </label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          >
            <option value="">Select Role</option>
            <option value="Manager">Manager</option>
            <option value="PantryStaff">Pantry Staff</option>
          </select>
        </div>

        {/* Contact Info Field */}
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-semibold text-gray-600">
            Contact Info
          </label>
          <input
            type="text"
            name="contactInfo"
            id="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
        </div>

        {/* Location Field */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-600">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;
