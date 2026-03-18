import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Signup from "./pages/SignupPage";
import Signin from "./pages/SigninPage";
import Welcome from "./pages/WelcomePage";
import HowItWorks from "./pages/HowItWorks";
import DashboardPage from "./pages/DashboardPage";
import About from "./pages/AboutPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import JournalPage from "./pages/JournalPage";
import TodayGoalPage from "./pages/TodayGoalPage";
import Quiz from "./pages/Quiz";
import Chatbot from "./pages/Chatbot";
import RecommendationsPage from "./pages/RecommendationsPage";
import PolicyPage from "./pages/Policy";


// ✅ Layout that keeps Sidebar always visible
const SidebarLayout = () => {
  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>

      {/* 🔓 Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/howitworks" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/policy" element={<PolicyPage/>} />
       
      

      {/* 🔓 Welcome route (Protected but WITHOUT sidebar) */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />

      {/* 🔐 Protected routes WITH sidebar */}
      <Route
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/today-goal" element={<TodayGoalPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />

        
       
        




      </Route>

    </Routes>
  );
};

export default App;
