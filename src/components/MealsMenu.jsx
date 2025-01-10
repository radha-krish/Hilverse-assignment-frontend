import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URLS } from "../utils/backend";

const MealsMenu = () => {
  const { patientId } = useParams(); // Get the patient ID from the route
  const [mealData, setMealData] = useState({
    morning: [],
    afternoon: [],
    night: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(`${API_URLS.getMealsByPatient}/${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data && data.data) {
          setMealData(data.data); // Set the meal data to the state
        } else {
          setMealData({ morning: [], afternoon: [], night: [] }); // Default to empty
        }
      } catch (error) {
        setError("Error fetching meal data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMealData();
  }, [patientId]);

  const handleMealChange = (mealType, index, field, value) => {
    const updatedMeals = { ...mealData };
    updatedMeals[mealType][index][field] = value;
    setMealData(updatedMeals);
  };

  const handleAddFoodItem = (mealType) => {
    const updatedMeals = { ...mealData };
    updatedMeals[mealType].push({ name: "", quantity: "", instructions: "" });
    setMealData(updatedMeals);
  };

  const handleRemoveFoodItem = (mealType, index) => {
    const updatedMeals = { ...mealData };
    updatedMeals[mealType].splice(index, 1);
    setMealData(updatedMeals);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(API_URLS.addOrUpdateMeals, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          morning: mealData.morning,
          afternoon: mealData.afternoon,
          night: mealData.night,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Meals updated successfully.");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating meal data:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-teal-700 mb-6">Meal Menu for Patient</h2>

      <div className="space-y-8">
        {/* Morning Meal */}
        <div className="bg-teal-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-teal-600 mb-4">Morning Meal</h3>
          {mealData.morning.map((foodItem, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <input
                type="text"
                placeholder="Food Name"
                value={foodItem.name}
                onChange={(e) => handleMealChange("morning", index, "name", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Quantity"
                value={foodItem.quantity}
                onChange={(e) => handleMealChange("morning", index, "quantity", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <textarea
                placeholder="Instructions (optional)"
                value={foodItem.instructions}
                onChange={(e) => handleMealChange("morning", index, "instructions", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <button
                type="button"
                className="text-red-600 hover:text-red-800 font-semibold"
                onClick={() => handleRemoveFoodItem("morning", index)}
              >
                Remove Item
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full text-teal-500 hover:text-teal-700 font-semibold p-3 mt-2 rounded-md bg-teal-50"
            onClick={() => handleAddFoodItem("morning")}
          >
            Add Food Item
          </button>
        </div>

        {/* Afternoon Meal */}
        <div className="bg-teal-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-teal-600 mb-4">Afternoon Meal</h3>
          {mealData.afternoon.map((foodItem, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <input
                type="text"
                placeholder="Food Name"
                value={foodItem.name}
                onChange={(e) => handleMealChange("afternoon", index, "name", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Quantity"
                value={foodItem.quantity}
                onChange={(e) => handleMealChange("afternoon", index, "quantity", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <textarea
                placeholder="Instructions (optional)"
                value={foodItem.instructions}
                onChange={(e) => handleMealChange("afternoon", index, "instructions", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <button
                type="button"
                className="text-red-600 hover:text-red-800 font-semibold"
                onClick={() => handleRemoveFoodItem("afternoon", index)}
              >
                Remove Item
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full text-teal-500 hover:text-teal-700 font-semibold p-3 mt-2 rounded-md bg-teal-50"
            onClick={() => handleAddFoodItem("afternoon")}
          >
            Add Food Item
          </button>
        </div>

        {/* Night Meal */}
        <div className="bg-teal-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-teal-600 mb-4">Night Meal</h3>
          {mealData.night.map((foodItem, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <input
                type="text"
                placeholder="Food Name"
                value={foodItem.name}
                onChange={(e) => handleMealChange("night", index, "name", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Quantity"
                value={foodItem.quantity}
                onChange={(e) => handleMealChange("night", index, "quantity", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <textarea
                placeholder="Instructions (optional)"
                value={foodItem.instructions}
                onChange={(e) => handleMealChange("night", index, "instructions", e.target.value)}
                className="w-full p-3 mb-2 border rounded-md"
              />
              <button
                type="button"
                className="text-red-600 hover:text-red-800 font-semibold"
                onClick={() => handleRemoveFoodItem("night", index)}
              >
                Remove Item
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full text-teal-500 hover:text-teal-700 font-semibold p-3 mt-2 rounded-md bg-teal-50"
            onClick={() => handleAddFoodItem("night")}
          >
            Add Food Item
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            className="bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 focus:outline-none"
          >
            Save Meals
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealsMenu;
