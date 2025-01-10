import React, { useState, useEffect } from "react";
import { toast ,ToastContainer} from "react-toastify";
import { API_URLS } from "../utils/backend";

const MealTracker = () => {
  const [inputDate, setInputDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [session, setSession] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [hasError, setHasError] = useState(false);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState("");
  const [deliverySpecialNotes, setDeliverySpecialNotes] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(API_URLS.getUniqueLocationsByRole, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: "Delivery" }),
        });

        if (!response.ok) throw new Error("Failed to fetch locations");
        const data = await response.json();
        setLocations(data.uniqueLocations);
      } catch (err) {
        toast.error(err.message || "Failed to fetch locations.");
      }
    };

    fetchLocations();
  }, []);

  const fetchDeliveryMenByLocation = async (location) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(API_URLS.getUsersByLocationAndRole, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: "Delivery",
          location,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch delivery men");
      const data = await response.json();
      setDeliveryMen(data);
    } catch (error) {
      toast.error(error.message || "Something went wrong while fetching delivery men.");
    }
  };

  const handleFilter = async () => {
    try {
      setHasError(false);
      const token = localStorage.getItem("token");
      const response = await fetch(API_URLS.getOrdersByFilters, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inputDate, orderStatus, deliveryStatus, session ,pantryId:"pantry"}),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (data.orders.length === 0) {
        setHasError(true);
        setOrders([]);
        setOrders([]);
        toast.info("No orders found for the selected filters.");
        return;
      }

      setOrders(data.orders);
      toast.success(data.message);
    } catch (error) {
      setHasError(true);
      toast.error(error.message || "Something went wrong!");
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevState) =>
      prevState.includes(orderId)
        ? prevState.filter((id) => id !== orderId)
        : [...prevState, orderId]
    );
  };

  const handleAssignDelivery = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URLS.updateOrdersStatusAndDeliveryStatus, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderIds: selectedOrders,
          location: selectedLocation,
          deliveryId: selectedDeliveryMan,
          deliverySpecialNotes,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success(data.message);
      setIsPopupOpen(false);
      setSelectedOrders([]);
    } catch (error) {
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
            <label className="block text-gray-700 font-medium mb-2">Order Date</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Order Status</label>
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
            <label className="block text-gray-700 font-medium mb-2">Delivery Status</label>
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
            <label className="block text-gray-700 font-medium mb-2">Session</label>
            <select
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              <option value="">Select Session</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="night">Night</option>
            </select>
          </div>
          <button
            onClick={handleFilter}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
          >
            Filter Orders
          </button>
        </div>

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Filtered Orders</h3>
            {orders.map((order) => (
              <div key={order._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => handleSelectOrder(order._id)}
                />
                {/* Order details here */}
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
                  </p>
              </div>
            ))}
            <button
              onClick={() => setIsPopupOpen(true)}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Assign Delivery Man
            </button>
          </div>
        )}

        {/* Popup for Assigning Delivery Man */}
        {isPopupOpen && (
          <div className="inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">Assign Delivery Man</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <select
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    fetchDeliveryMenByLocation(e.target.value);
                  }}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Delivery Man</label>
                <select
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  value={selectedDeliveryMan}
                  onChange={(e) => setSelectedDeliveryMan(e.target.value)}
                >
                  <option value="">Select Delivery Man</option>
                  {deliveryMen.map((man) => (
                    <option key={man._id} value={man._id}>
                      {man.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Special Notes</label>
                <textarea
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  value={deliverySpecialNotes}
                  onChange={(e) => setDeliverySpecialNotes(e.target.value)}
                />
              </div>
              <button
                onClick={handleAssignDelivery}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Assign Delivery
              </button>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default MealTracker;
