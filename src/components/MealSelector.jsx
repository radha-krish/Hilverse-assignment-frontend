import React, { useState, useEffect } from 'react';
import { API_URLS } from '../utils/backend';
// import { set } from 'mongoose';

const MealSelector = () => {
    const [mealTime, setMealTime] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [location, setLocation] = useState('');
    const [pantryStaff, setPantryStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [locations, setLocations] = useState([]);
    const [specialNotes, setSpecialNotes] = useState('');
    const [selectedPantryStaff, setSelectedPantryStaff] = useState(null);
    const [cookingSpecialNote, setCookingSpecialNote] = useState('');

    // Fetch unique locations based on PantryStaff role
    const fetchLocations = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(API_URLS.getUniqueLocationsByRole, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ role: "PantryStaff" }),
            });

            if (!response.ok) throw new Error('Failed to fetch locations');
            const data = await response.json();
            setLocations(data.uniqueLocations);
        } catch (err) {
            setError(err.message || 'Failed to fetch locations');
        }
    };

    // Fetch pantry staff based on selected location
    const fetchPantryStaff = async (selectedLocation) => {
        setLocation(selectedLocation);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(API_URLS.getUsersByLocationAndRole, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: "PantryStaff",
                    location: selectedLocation,
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch pantry staff');
            const data = await response.json();
            setPantryStaff(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch pantry staff');
        }
    };

    // Handle meal time selection
    const handleMealTimeChange = (event) => {
        setMealTime(event.target.value);
    };

    // Fetch patients based on selected meal time
    const fetchPatients = async () => {
        if (!mealTime) {
            setError('Please select a meal time');
            return;
        }

        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(API_URLS.getPatientsWithMeal, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ mealTime }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch patient data');
            }

            const data = await response.json();
            setPatients(data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch patient data');
        } finally {
            setLoading(false);
        }
    };

    // Handle patient selection
    const handlePatientSelection = (patientId) => {
        console.log(patientId, "id")
        console.log("pat", selectedPatients);
        setSelectedPatients((prevSelectedPatients) => {
            if (prevSelectedPatients.includes(patientId)) {
                return prevSelectedPatients.filter((id) => id !== patientId);
            }
            return [...prevSelectedPatients, patientId];
        });
    };

    // Handle order food for selected patients
    const orderFood = async () => {
        if (selectedPatients.length === 0 || !location || pantryStaff.length === 0) {
            setError('Please select at least one patient, location, and pantry staff');
            return;
        }


        const foodOrders = selectedPatients.map((patientId) => {
            const patient = patients.find((p) => p.patient._id === patientId);
            return {
                meals: patient.mealDetails,
            };
        });

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(API_URLS.orderFood, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    patientIds: selectedPatients,
                    session: mealTime,
                    foodDetails: foodOrders,
                    pantryStaffId: selectedPantryStaff,
                    location,
                    specialNotes,
                    cookingSpecialNote,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to order food');
            }

            alert('Food ordered successfully for selected patients');
            setShowModal(false);
        } catch (err) {
            setError(err.message || 'Failed to order food');
        }
    };

    // Open modal to select location and pantry staff
    const openOrderModal = () => {
        fetchLocations();
        setShowModal(true);
    };

    const handlePantryChange = (e) => {
        console.log(e.target.value)
        setSelectedPantryStaff(e.target.value)
    }

    useEffect(() => {
        if (showModal && locations.length === 0) {
            fetchLocations(); // Fetch locations when modal opens
        }
    }, [showModal, locations.length]);

    return (
        <div className="container mx-auto p-4">
            {/* Dropdown to select meal time */}
            <div className="mb-4">
                <label htmlFor="mealTime" className="block text-gray-700">Select Meal Time:</label>
                <select
                    id="mealTime"
                    value={mealTime}
                    onChange={handleMealTimeChange}
                    className="mt-2 p-2 border border-gray-300 rounded"
                >
                    <option value="">--Select--</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="night">Night</option>
                </select>
            </div>

            {/* Button to trigger fetching */}
            <button
                onClick={fetchPatients}
                className="mb-4 p-2 bg-blue-500 text-white rounded"
            >
                Fetch Patients
            </button>

            {/* Display loading or error messages */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Display patient details in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.length > 0 ? (
                    patients.map((patient) => (
                        <div
                            key={patient.patient._id}
                            className="p-4 border border-gray-300 rounded shadow-md"
                        >
                            <input
                                type="checkbox"
                                id={patient.patient._id}
                                checked={selectedPatients.includes(patient.patient._id)}
                                onChange={() => handlePatientSelection(patient.patient._id)}
                                className="mr-2"
                            />
                            <label htmlFor={patient._id} className="cursor-pointer">
                                <h3 className="text-lg font-semibold">{patient.patient.name}</h3>
                                <p className="text-sm text-gray-600">Room: {patient.patient.roomNumber}</p>
                                <p className="text-sm text-gray-600">BedNumber: {patient.patient.bedNumber}</p>
                                <p className="text-sm text-gray-600">Age: {patient.patient.age}</p>
                                <p className="text-sm text-gray-600">Gender: {patient.patient.gender}</p>
                            </label>
                            {/* Display meal details */}
                            {patient.mealDetails && patient.mealDetails.length > 0 ? (
                                <div className="mt-4">
                                    <h4 className="text-md font-medium">Meal Details:</h4>
                                    <ul className="list-disc ml-4">
                                        {patient.mealDetails.map((meal) => (
                                            <li key={meal._id} className="text-sm text-gray-600">
                                                <strong>{meal.name}</strong> - {meal.quantity}, {meal.instructions}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 mt-4">No meal details available.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No patients found for the selected meal time.</p>
                )}
            </div>

            {/* Button to open modal */}
            <button
                onClick={openOrderModal}
                className="mt-4 p-2 bg-green-500 text-white rounded"
            >
                Order Food for Selected Patients
            </button>

            {/* Modal to select location and pantry staff */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-1/3">
                        <h3 className="text-lg font-semibold mb-4">Select Location and Pantry Staff</h3>
                        {/* Location selection */}
                        <div className="mb-4">
                            <label htmlFor="location" className="block text-gray-700">Select Location:</label>
                            <select
                                id="location"
                                value={location}
                                onChange={(e) => fetchPantryStaff(e.target.value)}
                                className="mt-2 p-2 border border-gray-300 rounded"
                            >
                                <option value="">--Select--</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Pantry Staff selection */}
                        {pantryStaff.length > 0 && (
                            <div className="mb-4">
                                <label htmlFor="pantryStaff" className="block text-gray-700">Select Pantry Staff:</label>
                                <select
                                    id="pantryStaff"
                                    onChange={handlePantryChange}
                                    className="mt-2 p-2 border border-gray-300 rounded"
                                >
                                    <option value="" disabled selected>
                                        Select Pantry Staff
                                    </option>
                                    {pantryStaff.map((staff) => (
                                        <option key={staff._id} value={staff._id}>
                                            {staff.name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        )}

                        {/* Special Notes */}
                        <div className="mb-4">
                            <label htmlFor="specialNotes" className="block text-gray-700">Special Notes:</label>
                            <textarea
                                id="specialNotes"
                                value={specialNotes}
                                onChange={(e) => setSpecialNotes(e.target.value)}
                                className="mt-2 p-2 w-full border border-gray-300 rounded"
                            />
                        </div>

                        {/* Cooking Special Note */}
                        <div className="mb-4">
                            <label htmlFor="cookingSpecialNote" className="block text-gray-700">Cooking Special Note:</label>
                            <textarea
                                id="cookingSpecialNote"
                                value={cookingSpecialNote}
                                onChange={(e) => setCookingSpecialNote(e.target.value)}
                                className="mt-2 p-2 w-full border border-gray-300 rounded"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={orderFood}
                                className="p-2 bg-blue-500 text-white rounded mr-2"
                            >
                                Confirm Order
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 bg-gray-500 text-white rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealSelector;
