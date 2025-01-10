import React, { useState } from "react";
import { API_URLS } from "../utils/backend";
const PatientForm = () => {
  // Initial form state
  const [formData, setFormData] = useState({
    name: "",
    diseases: [""], // Initialize with one empty field for diseases
    allergies: [""], // Initialize with one empty field for allergies
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
    age: "",
    gender: "",
    contactInfo: "",
    emergencyContact: "",
    others: { additionalInfo: "" }, // Initialize with one dynamic field for 'others'
  });

  // Handle input change for normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle dynamic change for array fields (diseases and allergies)
  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  // Add a new input field to the array
  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  // Remove an input field from the array
  const removeArrayField = (index, field) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  // Handle dynamic change for 'others' map
  const handleOthersChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      others: {
        ...formData.others,
        [name]: value,
      },
    });
  };

  // Submit handler (you can add further logic to submit the form)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get the token from local storage
    const token = localStorage.getItem("token");
  
    if (!token) {
      // Handle the case when there is no token
      console.log("Token not found");
      return;
    }
  
    try {
      // Send form data to the backend with the token
      const response = await fetch(API_URLS.addPatient, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
  
      const data = await response.json();
      window.location.reload();
      console.log("Form submitted successfully", data);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h2 className="text-3xl font-semibold text-teal-700 mb-8">Patient Form</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Diseases */}
        <div>
          <label className="text-lg font-semibold text-gray-700 mb-2">Diseases</label>
          {formData.diseases.map((disease, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <input
                type="text"
                value={disease}
                onChange={(e) => handleArrayChange(e, index, "diseases")}
                className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-2/3"
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, "diseases")}
                className="text-red-600 hover:text-red-800 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("diseases")}
            className="text-teal-600 hover:text-teal-800 transition duration-300"
          >
            Add Disease
          </button>
        </div>

        {/* Allergies */}
        <div>
          <label className="text-lg font-semibold text-gray-700 mb-2">Allergies</label>
          {formData.allergies.map((allergy, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <input
                type="text"
                value={allergy}
                onChange={(e) => handleArrayChange(e, index, "allergies")}
                className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-2/3"
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, "allergies")}
                className="text-red-600 hover:text-red-800 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("allergies")}
            className="text-teal-600 hover:text-teal-800 transition duration-300"
          >
            Add Allergy
          </button>
        </div>

        {/* Other Dynamic Fields (Map) */}
        <div>
          <label className="text-lg font-semibold text-gray-700 mb-2">Additional Information</label>
          {Object.keys(formData.others).map((key, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <input
                type="text"
                name={key}
                value={formData.others[key]}
                onChange={handleOthersChange}
                placeholder={`Enter ${key}`}
                className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-2/3"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({ ...formData, others: { ...formData.others, newInfo: "" } })}
            className="text-teal-600 hover:text-teal-800 transition duration-300"
          >
            Add Additional Info
          </button>
        </div>

        {/* Room Number, Bed Number, Floor Number, Age, Gender, etc. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Bed Number</label>
            <input
              type="text"
              name="bedNumber"
              value={formData.bedNumber}
              onChange={handleChange}
              className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Floor Number</label>
            <input
              type="text"
              name="floorNumber"
              value={formData.floorNumber}
              onChange={handleChange}
              className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Emergency Contact</label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 text-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
