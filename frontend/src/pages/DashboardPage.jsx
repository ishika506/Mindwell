import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom"; // useNavigate is removed if not used
import FloatingReminders from "../components/FloatingReminders";
import API from "../services/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  IoHappyOutline,
  IoTrendingUpOutline,
  IoAnalyticsOutline,
  IoRibbonOutline,
  IoCheckmarkCircleOutline,
  IoBulbOutline,
  IoChatbubbleEllipsesOutline,
  IoCalendarOutline,
  IoListOutline,
  IoFitnessOutline,
  IoBookOutline,
  IoDocumentTextOutline, // New Icon for Journal
} from "react-icons/io5";
import Sidebar from "../components/Sidebar";

/* -----------------------------------------
      DASHBOARD (ULTRA-REFINED)
----------------------------------------- */

// Function to format the tooltip date (if data.last7MoodChart has "YYYY-MM-DD" format)
const formatTooltipDate = (date) => {
    if (!date) return '';
    // Assumes date is in YYYY-MM-DD format
    const [year, month, day] = date.split('-');
    return `${month}/${day}`; 
};

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#050D0E] p-3 rounded-lg shadow-2xl border border-teal-700/50 text-xs">
                <p className="text-teal-300 font-bold mb-1">Date: {formatTooltipDate(label)}</p>
                <p className="text-white">Score: <span className="font-extrabold text-lg text-teal-400">{payload[0].value}</span></p>
            </div>
        );
    }
    return null;
};


const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        
        // Calculate completedCount and enrich the data object
        const progress = res.data.dashboard.progress;
        const completedCount = [
          progress.activity,
          progress.journal,
          progress.quiz,
          progress.chat,
        ].filter(Boolean).length;

        setData({
          ...res.data.dashboard,
          progress: { ...progress, completedCount },
        });

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  // Professional Card Component for reusability (Enhanced Styling)
  const StatCard = ({ title, value, icon: Icon, colorClass = "text-teal-400" }) => (
    <div className="bg-[#152D30] p-6 rounded-2xl shadow-xl border border-[#2A474A] transform hover:scale-[1.02] transition-all duration-300 hover:border-teal-600/50 cursor-default">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase font-medium text-gray-400 tracking-widest">
          {title}
        </h3>
        {Icon && <Icon className={`w-6 h-6 ${colorClass}`} />}
      </div>
      <p className={`mt-3 text-4xl font-extrabold ${colorClass}`}>
        {value}
      </p>
    </div>
  );

  // Loading State
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0e2124] to-[#0a1517] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-400"></div>
        <div className="ml-4 text-xl text-teal-400">Loading your personalized space...</div>
      </div>
    );

  // Error/No Data State
  if (!data)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0e2124] to-[#0a1517] text-center p-20 text-lg text-gray-400">
        <h1 className="text-3xl font-bold text-red-400 mb-4">Data Error</h1>
        <p className="mt-4">
          We couldn't retrieve your mental well-being data. Please ensure the API is running correctly.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e2124] to-[#0a1517] text-gray-100 flex">
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-[240px] p-12 w-full relative">
        <FloatingReminders />

        {/* ---------------- WELCOME HEADER ---------------- */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-10 border-b border-[#2A474A] pb-8 mb-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Dashboard <span className="text-teal-400">Overview</span>
            </h1>
            <p className="mt-2 text-xl font-semibold text-teal-300">
              Hello, {user?.name || "Mindwell User"}!
            </p>
            <p className="mt-4 text-md text-gray-400 max-w-xl italic">
              "The power of now is the key to inner peace."
            </p>
          </div>

          {/* QUICK ACTION CARD (QUIZ) - Sleeker Look */}
          <div className="flex-1 flex justify-center w-full md:w-auto">
            <div className="bg-[#102325] shadow-2xl rounded-2xl p-6 w-full max-w-sm border border-teal-700/50 hover:bg-[#152D30] transition">
              <h2 className="text-xl font-bold text-teal-300 mb-2 flex items-center">
                <IoDocumentTextOutline className="mr-2 w-5 h-5" /> Today's Check-in
              </h2>

              <p className="text-gray-400 text-sm">
                Log your current state to keep your records accurate and actionable.
              </p>

              <Link
                to="/quiz"
                className="block mt-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl text-center transition shadow-lg shadow-teal-700/40 uppercase tracking-wider text-sm"
              >
                Start Mood Assessment
              </Link>
            </div>
          </div>
        </header>

        {/* ---------------- GRID: Key Performance Indicators ---------------- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mood Today */}
          <StatCard
            title="Current Mood Score"
            value={data.todayMood ? data.todayMood.mood : "N/A"}
            icon={IoHappyOutline}
            colorClass="text-yellow-400"
          />
          {/* Mood Trend */}
          <StatCard
            title="Weekly Trend"
            value={data.moodTrend.charAt(0).toUpperCase() + data.moodTrend.slice(1)}
            icon={IoTrendingUpOutline}
            colorClass={data.moodTrend === 'improving' ? "text-green-400" : "text-red-400"}
          />
          {/* Goal Streak */}
          <StatCard
            title="Goals Achieved Streak"
            value={`${data.streaks.goalStreak} days`}
            icon={IoRibbonOutline}
            colorClass="text-purple-400"
          />
          {/* Mood Streak */}
          <StatCard
            title="Mood Log Streak"
            value={`${data.streaks.moodStreak} days`}
            icon={IoCalendarOutline}
            colorClass="text-indigo-400"
          />
        </section>

        {/* ---------------- CHART & DAILY TASKS ---------------- */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="bg-[#152D30] p-6 rounded-2xl shadow-2xl border border-[#2A474A] lg:col-span-2">
            <h3 className="text-xl font-bold text-teal-300 mb-4 flex items-center">
              <IoAnalyticsOutline className="mr-2 w-5 h-5" />
              Mood Score Trajectory
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.last7MoodChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#2A474A" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#999" 
                    fontSize={12} 
                    tickFormatter={formatTooltipDate} 
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    stroke="#999" 
                    fontSize={12} 
                    label={{ value: 'Score (0-10)', angle: -90, position: 'insideLeft', fill: '#999', fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4FB3BF"
                    strokeWidth={4}
                    dot={{ fill: "#4FB3BF", r: 5, stroke: '#0e2124', strokeWidth: 2 }}
                    activeDot={{ r: 9, stroke: '#4FB3BF', fill: '#0e2124', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Goals & Progress - Highly Visual */}
          <div className="bg-[#152D30] p-6 rounded-2xl shadow-2xl border border-[#2A474A] lg:col-span-1">
            <h3 className="text-xl font-bold text-teal-300 mb-6 flex items-center">
              <IoCheckmarkCircleOutline className="mr-2 w-6 h-6" />
              Daily Task Completion
            </h3>
            
            <ul className="space-y-4 text-gray-300">
              {[
                { label: 'Physical Activity', key: 'activity', icon: IoFitnessOutline },
                { label: 'Mind Journaling', key: 'journal', icon: IoDocumentTextOutline },
                { label: 'Self-Assessment Quiz', key: 'quiz', icon: IoListOutline },
                { label: 'Therapeutic Chat', key: 'chat', icon: IoChatbubbleEllipsesOutline },
              ].map(({ label, key, icon: TaskIcon }) => (
                <li key={key} className="flex justify-between items-center text-md border-b border-[#2A474A] pb-2">
                  <span className="flex items-center font-medium">
                    <TaskIcon className="mr-3 w-5 h-5 text-teal-400" />
                    {label}
                  </span>
                  <span className={`font-extrabold text-sm px-3 py-1 rounded-full ${
                      data.progress[key] ? "bg-green-700/50 text-green-300" : "bg-red-700/50 text-red-300"
                  }`}>
                    {data.progress[key] ? "DONE" : "PENDING"}
                  </span>
                </li>
              ))}
            </ul>
            
            {/* Progress Summary */}
            <div className="mt-8 pt-4 border-t border-teal-700/40 flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-300">
                    Goals Completed:
                </p>
                <span className="text-4xl font-extrabold text-teal-400">
                    {data.progress.completedCount}<span className="text-xl text-gray-500">/4</span>
                </span>
            </div>
          </div>
        </section>

        {/* ---------------- ADVICE & MOTIVATION ---------------- */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Suggestions */}
          <div className="bg-[#152D30] p-6 rounded-2xl shadow-2xl border border-[#2A474A]">
            <h3 className="text-xl font-bold text-teal-300 flex items-center mb-3">
              <IoBulbOutline className="mr-2 w-6 h-6" />
              Actionable Recommendations
            </h3>
            <ul className="mt-3 list-disc ml-6 text-gray-300 space-y-3">
              {data.suggestions.map((s, i) => (
                <li key={i} className="text-sm border-l-4 border-teal-600/50 pl-3">
                    {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Motivation */}
          <div className="bg-[#152D30] p-6 rounded-2xl shadow-2xl border border-[#2A474A] flex items-center justify-center transition hover:shadow-teal-900/50">
            <blockquote className="text-center">
              <p className="text-2xl font-serif italic text-teal-300">
                "{data.motivationalMessage}"
              </p>
              <footer className="mt-4 text-sm font-light text-gray-500">
                — Daily Dose of Inspiration
              </footer>
            </blockquote>
          </div>
        </section>

        {/* Footer/Final Quote */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-gray-500 italic border-t border-[#2A474A] pt-4">
            Mindwell v1.0. Your commitment is your biggest strength.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;