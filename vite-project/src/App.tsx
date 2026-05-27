import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/dashboardlayout";

import Dashboard from "./pages/dashboard";
import Booking from "./pages/booking";
import QueueStatus from "./pages/queuestatus";
import History from "./pages/history";
import Settings from "./pages/setting";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  return (
    
      <Routes>

      {/* Public Route */}
      <Route path="/" element={<Landing />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />

      <Route
        path="/booking"
        element={
          <DashboardLayout>
            <Booking />
          </DashboardLayout>
        }
      />

      <Route
        path="/queue"
        element={
          <DashboardLayout>
            <QueueStatus />
          </DashboardLayout>
        }
      />

      <Route
        path="/history"
        element={
          <DashboardLayout>
            <History />
          </DashboardLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        }
      />

    </Routes>
  
  
  );
}

export default App;