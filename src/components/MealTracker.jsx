import React, { useState } from "react";
import { toast } from "react-toastify";
import { API_URLS } from "../utils/backend";

const MealTracker = () => {
  const [inputDate, setInputDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [session, setSession] = useState(""); // Added session state
  const [orders, setOrders] = useState([]);
  const [hasError, setHasError] = useState(false);

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
        body: JSON.stringify({ inputDate, orderStatus, deliveryStatus, session }), // Added session to the request body
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

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Orders</h2>

        {/* Filter Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Order Date
            </label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Order Status
            </label>
            <select
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="">Select Order Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Delivery Status
            </label>
            <select
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
            >
              <option value="">Select Delivery Status</option>
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Session
            </label>
            <select
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
              value={session}
              onChange={(e) => setSession(e.target.value)} // Update session state
            >
              <option value="">Select Session</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="night">Night</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleFilter}
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Filter Orders
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Filtered Orders
            </h3>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
                >
                    <p className="text-gray-700">
                    <strong>Session</strong> {order.session}
                  </p>
                  <p className="text-gray-700">
                    <strong>Patient Name:</strong> {order.patientId.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Room:</strong> {order.patientId.roomNumber}, Bed:{" "}
                    {order.patientId.bedNumber}
                  </p>
                  <p className="text-gray-700">
                    <strong>Pantry Staff:</strong> {order.pantryId.name} (
                    {order.pantryId.contactInfo})
                  </p>
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
                  <p className="text-gray-700">
                    <strong>Order Status:</strong> {order.orderStatus}
                  </p>
                  <p className="text-gray-700">
                    <strong>Delivery Status:</strong> {order.deliveryStatus}
                  </p>
                  <p className="text-gray-700">
                    <strong>Special Notes:</strong> {order.specialNotes || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong> Cooking Special Notes:</strong> {order.cookingSpecialNotes || "N/A"}
                  </p> <p className="text-gray-700">
                    <strong> Delivery Special Notes:</strong> {order.deliverySpecialNotes || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Order Placed At:</strong>{" "}
                    {new Date(order.orderPlacedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Orders Found */}
        {hasError && orders.length === 0 && (
          <div className="mt-6 text-center text-gray-700">
            <p>No orders found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealTracker;
