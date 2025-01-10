import React, { useState, useEffect } from "react";
import { API_URLS } from "../../utils/backend";
const ViewPantryStaff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch pantry staff data from backend
    const fetchStaffMembers = async () => {
      try {
        const response = await fetch(API_URLS.getPantry, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pantry staff");
        }
        const data = await response.json();
        setStaffMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMembers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-teal-700 mb-8">Pantry Staff Members</h2>
      
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {staffMembers.map((staff) => (
            <div
              key={staff._id}
              className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-teal-800">{staff.name}</h3>
                <p className="text-sm text-gray-500">{staff.role}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-800">{staff.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Contact Info:</span>
                  <span className="text-gray-800">{staff.contactInfo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Location:</span>
                  <span className="text-gray-800">{staff.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Joined:</span>
                  <span className="text-gray-800">{new Date(staff.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewPantryStaff;
