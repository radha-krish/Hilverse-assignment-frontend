import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_URLS } from "../utils/backend";

const DeliverManagement = () => {
  const [orders, setOrders] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [inputDate, setInputDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [selectedOrders, setSelectedOrders] = useState([]); // Array to track selected orders

  // Handle fetching orders based on date
  const handleFilter = async () => {
    try {
      setHasError(false); // Reset error state
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await fetch(API_URLS.getOrdersByFilters, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ inputDate, pantryId: "deliver" }), // Send the date to the backend
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (data.orders.length === 0) {
        setHasError(true);
        setOrders([]);
        toast.info("No orders found for the selected filters.");
        return;
      }

      setOrders(data.orders);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      setHasError(true);
      toast.error(error.message || "Something went wrong!");
    }
  };

  // Fetch orders when the component mounts or when inputDate changes
  useEffect(() => {
    handleFilter();
  }, [inputDate]);

  // Handle selecting an order
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter((id) => id !== orderId); // Deselect
      } else {
        return [...prevSelectedOrders, orderId]; // Select
      }
    });
  };

  // Handle making selected orders "In Progress"
  const handleMakeInProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URLS.updateOrdersStatusAndDeliveryStatus, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderIds: selectedOrders, deliveryStatus: "inProgress" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Orders updated to 'In Progress'.");
      setSelectedOrders([]); // Clear selected orders after update
      handleFilter(); // Re-fetch orders after update
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  // Handle making selected orders "Complete"
  const handleMakeComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URLS.updateOrdersStatusAndDeliveryStatus, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderIds: selectedOrders, deliveryStatus: "delivered" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Orders updated to 'Complete'.");
      setSelectedOrders([]); // Clear selected orders after update
      handleFilter(); // Re-fetch orders after update
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>

      {/* Date Picker */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <input
          type="date"
          id="date"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Buttons for making orders In Progress or Complete */}
      <div className="mb-4">
        <button
          onClick={handleMakeInProgress}
          disabled={selectedOrders.length === 0}
          className="mr-4 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
        >
           In Progress
        </button>
        <button
          onClick={handleMakeComplete}
          disabled={selectedOrders.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-400"
        >
          Deliverd
        </button>
      </div>

      {/* Order List */}
      <div className="mt-6">
        {hasError ? (
          <p className="text-red-500">Error fetching orders.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order._id} className="bg-white p-4 mb-2 rounded-md shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">{order.orderId}</span>
                  <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleSelectOrder(order._id)}
                    className="ml-4"
                  />
                </div>
                <p className="text-gray-600">Order Status: {order.orderStatus}</p>
                <p className="text-gray-600">Delivery Status: {order.deliveryStatus}</p>
                <p className="text-gray-600">Session: {order.session}</p>
                <p className="text-gray-600">Patient Name: {order.patientId.name}</p>
                <p className="text-gray-600">Room: {order.patientId.roomNumber}</p>
                <p className="text-gray-700">
                  <strong>Food Details:</strong>
                  <ul className="list-disc pl-6">
                    {order.foodDetails.map((food) => (
                      <li key={food._id}>
                        {food.name} - {food.quantity} ({food.instructions})
                      </li>
                    ))}
                  </ul>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeliverManagement;
