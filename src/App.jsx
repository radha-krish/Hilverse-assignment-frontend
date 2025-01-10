import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssignDelivery from "./components/AssignDelivery";
import DeliverManagement from "./components/delivermanage";
import DeliveryManDashboard from "./components/DeliveryDashboard";
import Login from "./components/Login";
import ViewDelivery from './components/Pantries/ViewDelivery'
import PantryMealTracker from './components/PantryMealTracker';
import Delivery from './components/Delivery';
import OrderManagement from "./components/Pantries/OrderManagement";
import Dashboard from "./components/Dashboard";
import PantryStaffDashboard from "./components/PantryStaffDashboard";
import Patients from "./components/Patients";
import MealsMenu from "./components/MealsMenu";
import MealTracker from "./components/MealTracker";
import Pantry from "./components/Pantries/Pantry";
import ViewPantryStaff from "./components/Pantries/ViewPantries";
import MealSelector from "./components/MealSelector";
// import MealTracker from "./components/MealTracker";
import ViewPatients from "./components/ViewPatients";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-patient" element={<Patients />} />
          <Route path="show-patients" element={<ViewPatients />} />
          <Route path="meals/:patientId" element={<MealsMenu />} />
          <Route path="order-foodto-patients" element={<MealSelector />} />
          <Route path="track-meal/orders" element={<MealTracker />} /> {/* <Route path="menu" element={<Menu />} /> */}
          <Route path="view-pantry" element={<ViewPantryStaff />} />

          <Route path="add-pantry" element={<Pantry />} />
          {/* <Route path="track-meal" element={<MealTracker />} /> */}
        </Route>
        <Route path="/pantrystaffdashboard" element={<PantryStaffDashboard />}>
        <Route path="manage-orders" element={<OrderManagement />} />
        <Route path="add-deliveryman" element={<Delivery />} />

        <Route path="view-orders" element={<PantryMealTracker role="pantry" />} /> {/* <Route path="menu" element={<Menu />} /> */}

        <Route path="view-deliverymen" element={<ViewDelivery />} /> {/* <Route path="menu" element={<Menu />} /> */}
        
        <Route path="assign-delivery" element={<AssignDelivery />} /> {/* <Route path="menu" element={<Menu />} /> */}

        </Route>
        <Route path="/deliverydashboard" element={<DeliveryManDashboard/>}>
        <Route path="view-orders" element={<PantryMealTracker role="deliver" />} /> {/* <Route path="menu" element={<Menu />} /> */}
        <Route path="manage-orders" element={<DeliverManagement />} /> {/* <Route path="menu" element={<Menu />} /> */}

        </Route>

      </Routes>
    </Router>
  );
};

export default App;
