import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const PantryStaffDashboard = () => {
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false); // State to toggle order menu
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hook to track the current location and close the sidebar on navigation
  const location = useLocation();

  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false); // Close the sidebar when navigating
    }
  }, [location]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 bg-teal-800 text-white p-6 shadow-lg h-full z-10 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block md:h-full md:static md:w-64`}
      >
        <h2 className="text-2xl font-bold mb-8 text-teal-100">Pantry Staff Dashboard</h2>
        <nav className="space-y-6">
          {/* Delivery Management Section */}
          <div>
            <h3
              className="text-lg font-semibold cursor-pointer text-teal-100 border-2 border-transparent hover:border-teal-300 hover:bg-teal-600 rounded px-4 py-2 transition duration-300"
              onClick={() => setDeliveryOpen(!deliveryOpen)}
            >
              Delivery Management
            </h3>
            {deliveryOpen && (
              <ul className="space-y-2 ml-4">
                <li>
                  <Link
                    to="add-deliveryman"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    Add Delivery Person
                  </Link>
                </li>
                <li>
                  <Link
                    to="view-deliverymen"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    View Delivery Persons
                  </Link>
                </li>
                <li>
                  <Link
                    to="assign-delivery"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    Assign Deliveries
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Order Management Section */}
          <div>
            <h3
              className="text-lg font-semibold cursor-pointer text-teal-100 border-2 border-transparent hover:border-teal-300 hover:bg-teal-600 rounded px-4 py-2 transition duration-300"
              onClick={() => setOrderOpen(!orderOpen)}
            >
              Order Management
            </h3>
            {orderOpen && (
              <ul className="space-y-2 ml-4">
                <li>
                  <Link
                    to="view-orders"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    View Orders
                  </Link>
                </li>
                
                <li>
                  <Link
                    to="manage-orders"
                    className="block py-2 px-4 rounded hover:bg-teal-600 text-teal-100 transition duration-300"
                  >
                    Manage Orders
                  </Link>
                </li>
              </ul>
            )}
          </div>
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
        className="fixed top-4 left-4 z-20 md:hidden p-2 bg-teal-800 text-white rounded mt-8"
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

export default PantryStaffDashboard;
