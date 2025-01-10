import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [patientsOpen, setPatientsOpen] = useState(false);
  const [pantryOpen, setPantryOpen] = useState(false);
  const [mealsOpen, setMealsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hook to track the current location and close the sidebar on navigation
  const location = useLocation();

  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false); // Close the sidebar when navigating
    }
  }, [location]);

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 bg-teal-800 text-white p-6 shadow-lg h-full z-10 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block md:h-full md:static md:w-64`}
      >
        <h2 className="text-2xl font-bold mb-8 text-teal-100">Hospital Food Manager</h2>
        <nav className="space-y-6">
          {/* Patient Section */}
          <div>
            <h3
              className="text-lg font-semibold cursor-pointer text-teal-100 border-2 border-transparent hover:border-teal-300 hover:bg-teal-600 rounded px-4 py-2 transition duration-300"
              onClick={() => setPatientsOpen(!patientsOpen)}
            >
              Patients
            </h3>
            {patientsOpen && (
              <ul className="space-y-2 ml-4">
                <li>
                  <Link
                    to="add-patient"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    Add Patient
                  </Link>
                </li>
                <li>
                  <Link
                    to="show-patients"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    View Patients
                  </Link>
                </li>
                <li>
                  <Link
                    to="order-foodto-patients"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                   OrderFood
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Pantry Section */}
          <div>
            <h3
              className="text-lg font-semibold cursor-pointer text-teal-100 border-2 border-transparent hover:border-teal-300 hover:bg-teal-600 rounded px-4 py-2 transition duration-300"
              onClick={() => setPantryOpen(!pantryOpen)}
            >
              Pantry
            </h3>
            {pantryOpen && (
              <ul className="space-y-2 ml-4">
                <li>
                  <Link
                    to="add-pantry"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    Add Pantry
                  </Link>
                </li>
                <li>
                  <Link
                    to="view-pantry"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    View Pantry
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Meals Section */}
          <div>
            <h3
              className="text-lg font-semibold cursor-pointer text-teal-100 border-2 border-transparent hover:border-teal-300 hover:bg-teal-600 rounded px-4 py-2 transition duration-300"
              onClick={() => setMealsOpen(!mealsOpen)}
            >
              Meals
            </h3>
            {mealsOpen && (
              <ul className="space-y-2 ml-4">
                <li>
                  <Link
                    to="track-meal/orders"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    MealTracker 
                  </Link>
                </li>
                <li>
                 
                </li>
              </ul>
            )}
          </div>

          {/* Menu Section */}
            <div>
                      <Link
                        to="/"
                        className="block py-2 px-4 rounded text-teal-100 bg-teal-600 hover:bg-teal-700 transition duration-300"
                      >
                        Logout
                      </Link>
                    </div>
         
        </nav>
      </div>

      {/* Mobile Hamburger Icon */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-20 md:hidden p-2 bg-teal-800 text-white rounded mt-8" // Added margin-top for spacing
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

   {/* Main Content Area */}
   <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
