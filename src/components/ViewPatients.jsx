import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URLS } from "../utils/backend";

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientsData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        // Fetch all patients from the backend with the token in the Authorization header
        const response = await fetch(API_URLS.getPatients, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Set patient data to state
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchPatientsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">No patients found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-teal-700 mb-6">Patients List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md relative"
          >
            <h3 className="text-xl font-semibold text-teal-600">
              {patient.name}
            </h3>
            <p className="text-lg text-gray-700">Age: {patient.age}</p>
            <p className="text-lg text-gray-700">Gender: {patient.gender}</p>
            <p className="text-lg text-gray-700">
              Room Number: {patient.roomNumber}
            </p>
            <p className="text-lg text-gray-700">
              Bed Number: {patient.bedNumber}
            </p>

            {/* Add more fields or additional styling as necessary */}
            <div className="mt-4">
              <Link
                to={`/patients/${patient._id}`} // Assuming each patient has a unique ID
                className="text-teal-500 hover:text-teal-700 text-lg font-semibold"
              >
                View Details
              </Link>
            </div>

            {/* Add Menu Button */}
            <button
  className="absolute bottom-4 right-4 bg-blue-700 text-white rounded-md p-2 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
>
  <Link to={`/dashboard/meals/${patient._id}`} className="flex items-center gap-2">
    Assign Menu
    <span className="sr-only">Open menu</span>
    {/* Replace with react-icons for better icons */}
    <i className="fas fa-ellipsis-v"></i>
  </Link>
</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const handleMenu = (patientId) => {
  // Redirect to a meal management page for the patient
  window.location.href = `/meals/${patientId}`;
};

export default ViewPatients;
