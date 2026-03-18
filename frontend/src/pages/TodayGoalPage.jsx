// TodayGoalPage.jsx
import React, { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoBookOutline,
  IoFitnessOutline,
  IoHappyOutline,
  IoChatbubbleEllipsesOutline,
  IoWalkOutline, // Use Walk icon for activity
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion"; // Added motion import for future enhancements

const TodayGoalPage = () => {
  const [todayGoal, setTodayGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Theme Consistency ---
  const bgColor = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]"; // Deep dark background
  const cardBg = "bg-[#152D30]"; // Card background
  const tealPrimary = "#4FB3BF";
  const lightTeal = "#B6F2DD";
  const completedColor = "text-green-400";
  const taskTextColor = "text-white";

  useEffect(() => {
    const fetchTodayGoal = async () => {
      try {
        const res = await API.get("/today-goal");
        setTodayGoal(res.data.goal);
      } catch (err) {
        console.error("Error loading goal:", err);
        // Default structure fallback
        setTodayGoal({
            activity: { name: "Physical Activity", description: "Select a movement or breathing exercise.", completed: false },
            journal: { name: "Journal Entry", description: "Reflect and write your daily thoughts.", completed: false },
            quiz: { name: "Mood Check-in", description: "Track your mood today.", completed: false },
            chat: { name: "Therapeutic Chat", description: "Talk with AI to reflect and improve.", completed: false },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTodayGoal();
  }, []);

  // Ensure todayGoal is not null before calculating progress
  const tasks = todayGoal ? [
    todayGoal.activity,
    todayGoal.journal,
    todayGoal.quiz,
    todayGoal.chat,
  ] : [];

  const completedCount = tasks.filter(task => task?.completed).length;
  const totalTasks = tasks.length || 4; // Assume 4 tasks if data hasn't loaded properly
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  
  // Custom Goal Card Component (Refined Styling)
  const GoalCard = ({ name, description, icon, completed, onClick, color }) => {
    const handleClick = () => {
      if (!completed && onClick) {
        onClick();
      }
    };

    return (
        <motion.div
            whileHover={!completed ? { scale: 1.03, boxShadow: "0 20px 30px rgba(0,0,0,0.4)" } : {}}
            transition={{ type: "spring", stiffness: 250 }}
            onClick={handleClick}
            className={`${cardBg} rounded-xl p-6 transition-all duration-300 ${color} border-l-8 
                        ${completed ? "opacity-70 cursor-default" : "cursor-pointer hover:bg-[#1a3336]"} shadow-xl text-gray-100`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 flex-shrink-0">
                        {icon}
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${completed ? "text-gray-400 line-through" : taskTextColor}`}>
                            {name}
                        </h2>
                        <p className="text-gray-400 mt-1 text-sm">{description}</p>
                    </div>
                </div>
                
                <div className="flex-shrink-0">
                    {completed ? (
                        <IoCheckmarkCircleOutline size={30} className={completedColor} />
                    ) : (
                         <span className="text-sm font-semibold text-gray-500 mt-1">Pending</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
  };

  // Loading State
  if (loading)
    return (
      <div className={`flex-1 ml-[240px] min-h-screen flex justify-center items-center ${bgColor} text-gray-400`}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400"></div>
        <p className="ml-4 text-lg">Loading your daily goals...</p>
      </div>
    );
    
  // Data array for mapping (using consistent theme colors)
  const cardData = [
    {
      name: todayGoal.activity?.name || "Physical Activity",
      description: todayGoal.activity?.description || "Select a goal-related activity from the library to check this off.",
      icon: <IoWalkOutline size={28} className="text-pink-400" />,
      completed: todayGoal.activity?.completed,
      onClick: () => navigate("/activities"),
      color: "border-pink-500/80", // Using pink for physical/movement goals
    },
    {
      name: todayGoal.journal?.name || "Journal Entry",
      description: todayGoal.journal?.description || "Reflect and write your daily thoughts.",
      icon: <IoBookOutline size={28} className="text-yellow-400" />,
      completed: todayGoal.journal?.completed,
      onClick: () => navigate("/journal"),
      color: "border-yellow-500/80", // Using yellow for journal/reflection
    },
    {
      name: todayGoal.quiz?.name || "Mood Check-in",
      description: todayGoal.quiz?.description || "Take the quiz to track your current mood.",
      icon: <IoHappyOutline size={28} className="text-teal-400" />,
      completed: todayGoal.quiz?.completed,
      onClick: () => navigate("/quiz"),
      color: "border-teal-500/80", // Using teal for mood/quiz
    },
    {
      name: todayGoal.chat?.name || "Therapeutic Chat",
      description: todayGoal.chat?.description || "Engage with the AI coach for support.",
      icon: <IoChatbubbleEllipsesOutline size={28} className="text-indigo-400" />,
      completed: todayGoal.chat?.completed,
      onClick: () => navigate("/chat"),
      color: "border-indigo-500/80", // Using indigo for chat/interaction
    },
  ];


  return (
    <div className={`flex-1 ml-[240px] min-h-screen ${bgColor} flex justify-center items-start py-16 px-6`}>
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white flex items-center justify-center gap-3">
                <IoCheckmarkCircleOutline className="text-teal-400" size={40} />
                <span className="text-teal-400">Daily</span> Focus Goals
            </h1>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
                These four activities are key to maintaining your mental well-being today. Click to start!
            </p>
        </header>

        {/* Progress Display */}
        <div className="mb-12">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xl font-semibold text-gray-200">
                    Overall Progress
                </p>
                <p className="text-2xl font-extrabold text-teal-400">
                    {completedCount}/{totalTasks} <span className="text-base text-gray-400">tasks completed</span>
                </p>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-4 bg-[#2A474A] rounded-full shadow-inner overflow-hidden">
                <motion.div
                    className="h-full rounded-full shadow-md"
                    style={{ background: `linear-gradient(90deg, ${tealPrimary}, ${lightTeal})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <span className="block text-right pr-3 font-bold text-black text-xs leading-4" style={{ minWidth: '40px' }}>
                        {Math.round(progressPercentage)}%
                    </span>
                </motion.div>
            </div>
        </div>

        {/* Goal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cardData.map((card, idx) => (
            <GoalCard 
              key={idx}
              name={card.name}
              description={card.description}
              icon={card.icon}
              completed={card.completed}
              onClick={card.onClick}
              color={card.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayGoalPage;