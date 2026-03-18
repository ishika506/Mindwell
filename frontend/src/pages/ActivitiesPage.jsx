import React, { useEffect, useState } from "react";

import ActivityModal from "../components/ActivityModal";
import API from "../services/api";
import { useOutletContext } from "react-router-dom";
import { 
    IoWalkOutline, 
    IoColorPaletteOutline, 
    IoMusicalNoteOutline,
    IoBodyOutline,
    IoLeafOutline,
    IoChatbubbleOutline,
    IoHeartCircleOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";

// Activities imports (kept as-is, assuming they are imported correctly)
import StarfishBreathing from "../activities/StarfishBreathing";
import RainbowGratitude from "../activities/RainbowGratitude";
import TeddyTummyBreathing from "../activities/TeddyBreathing";
import CloudThoughts from "../activities/CloudThoughts";
import CalmCounting from "../activities/CalmCounting";
import EmotionCheckIn from "../activities/EmotionCheckIn";
import FiveSensesGrounding from "../activities/FiveSensesGrounding";
import ShakeItOutMovement from "../activities/ShakeItOut";
import AffirmationMirror from "../activities/AffirmationMirror";
import ColorCalmMaze from "../activities/ColorCalmMaze";
import PositiveWordBuilder from "../activities/PositiveWordBuilder";
import MusicMoodMatch from "../activities/MusicMoodMatch";
import StretchAlong from "../activities/StretchAlong";
import DrawYourFeelings from "../activities/DrawYourFeelings";
import CalmCardsShuffle from "../activities/CalmCardsShuffle";
import MountainBreathing from "../activities/MountainBreathing";
import FreezeRelax from "../activities/FreezeRelax";
import CalmStory from "../activities/CalmStory";
import BoxBreathing from "../activities/BoxBreathing";
import Name3Things from "../activities/Name3Things";
import SafePlaceVisualization from "../activities/SafePlaceVisualization";
import LightBreathingVisual from "../activities/LightBreathingVisual";
import DailyThoughtPrompt from "../activities/DailyThoughtPrompt";
import SlowBalanceWalk from "../activities/SlowBalanceWalk";

// --- Configuration for Categorization and Icons ---
const activityMapping = {
    "Starfish Breathing": { component: StarfishBreathing, category: "Breathing", icon: IoLeafOutline },
    "Rainbow Gratitude": { component: RainbowGratitude, category: "Grounding", icon: IoHeartCircleOutline },
    "Teddy Tummy Breathing": { component: TeddyTummyBreathing, category: "Breathing", icon: IoLeafOutline },
    "Cloud Thoughts": { component: CloudThoughts, category: "Visualization", icon: IoChatbubbleOutline },
    "Calm Counting (Bubble Popping)": { component: CalmCounting, category: "Grounding", icon: IoHeartCircleOutline },
    "Emotion Check-In": { component: EmotionCheckIn, category: "Self-Reflection", icon: IoBodyOutline },
    "5 Senses Grounding": { component: FiveSensesGrounding, category: "Grounding", icon: IoHeartCircleOutline },
    "Shake It Out Movement": { component: ShakeItOutMovement, category: "Movement", icon: IoWalkOutline },
    "Affirmation Mirror": { component: AffirmationMirror, category: "Self-Reflection", icon: IoBodyOutline },
    "Color Calm Maze": { component: ColorCalmMaze, category: "Creative", icon: IoColorPaletteOutline },
    "Positive Word Builder": { component: PositiveWordBuilder, category: "Creative", icon: IoColorPaletteOutline },
    "Music Mood Match": { component: MusicMoodMatch, category: "Creative", icon: IoMusicalNoteOutline },
    "Stretch Along": { component: StretchAlong, category: "Movement", icon: IoWalkOutline },
    "Draw Your Feelings": { component: DrawYourFeelings, category: "Creative", icon: IoColorPaletteOutline },
    "Calm Cards Shuffle": { component: CalmCardsShuffle, category: "Self-Reflection", icon: IoBodyOutline },
    "Mountain Breathing": { component: MountainBreathing, category: "Breathing", icon: IoLeafOutline },
    "Freeze & Relax": { component: FreezeRelax, category: "Movement", icon: IoWalkOutline },
    "Calm Story": { component: CalmStory, category: "Visualization", icon: IoChatbubbleOutline },
    "Box Breathing": { component: BoxBreathing, category: "Breathing", icon: IoLeafOutline },
    "Name 3 Things": { component: Name3Things, category: "Grounding", icon: IoHeartCircleOutline },
    "Safe Place Visualization": { component: SafePlaceVisualization, category: "Visualization", icon: IoChatbubbleOutline },
    "Light Breathing Visual": { component: LightBreathingVisual, category: "Visualization", icon: IoLeafOutline },
    "Daily Thought Prompt": { component: DailyThoughtPrompt, category: "Self-Reflection", icon: IoBodyOutline },
    "Slow Balance Walk": { component: SlowBalanceWalk, category: "Movement", icon: IoWalkOutline },
};

// --- Refactored Component ---

const ActivitiesPage = () => {
    // Context setup
    const outletContext = useOutletContext() || {};
    const openGoalPopup = outletContext.openGoalPopup || false;
    const setOpenGoalPopup = outletContext.setOpenGoalPopup || (() => {});

    const [showPopup, setShowPopup] = useState(false);
    const [todayGoal, setTodayGoal] = useState(null);
    const [activities, setActivities] = useState([]);
    const [todayLogs, setTodayLogs] = useState([]);
    const [selectedActivityComponent, setSelectedActivityComponent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Group activities by category
    const categorizedActivities = activities.reduce((acc, activity) => {
        const type = activityMapping[activity.name]?.category || "General";
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(activity);
        return acc;
    }, {});


    const fetchTodayGoal = async () => {
        try {
            const res = await API.get("/today-goal");
            setTodayGoal(res.data.goal);
        } catch (err) {
            console.error("Error fetching today goal:", err);
        }
    };

    const fetchActivities = async () => {
        try {
            const res = await API.get("/activities");
            setActivities(res.data.activities);
        } catch (err) {
            console.error("Error loading activities:", err);
        }
    };

    const fetchTodayLogs = async () => {
        try {
            const res = await API.get("/activity-log/today");
            // Logs contain activityId.activity_id if logs array is populated
            setTodayLogs(res.data.logs.map((log) => log.activityId._id));
        } catch (err) {
            console.error("Error loading today logs:", err);
        }
    };

    const handleStartActivity = async (activity) => {
        const ActivityData = activityMapping[activity.name];

        if (!ActivityData || !ActivityData.component) {
            console.error(`Activity Component not found for: ${activity.name}`);
            return;
        }

        setSelectedActivityComponent(() => ActivityData.component);

        try {
            // Log the activity completion
            await API.post("/activity-log", { activityId: activity._id });
            
            // Re-fetch necessary data after logging
            await fetchTodayGoal();
            await fetchTodayLogs();
        } catch (err) {
            alert(err.response?.data?.message || "Error marking activity");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchActivities(),
                fetchTodayGoal(),
                fetchTodayLogs(),
            ]);
            setIsLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (openGoalPopup) {
            setShowPopup(true);
            setOpenGoalPopup(false);
        }
    }, [openGoalPopup, setOpenGoalPopup]);


    // --- Styling Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const cardBorder = "border-[#2A474A]";
    const tealPrimary = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white";
    const buttonCompleted = "bg-green-700/50 text-green-300 cursor-not-allowed";

    if (isLoading) {
        return (
             <div className={`flex-1 ml-[240px] min-h-screen flex justify-center items-center ${primaryBg} text-gray-400`}>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400"></div>
                <p className="ml-4 text-lg">Loading activities library...</p>
            </div>
        );
    }
    
    return (
        <div className={`min-h-screen p-10 ${primaryBg} text-gray-100 ml-[240px]`}>
            {/* Today Goal Popup */}
            {showPopup && (
                <TodayGoalPopup goal={todayGoal} onClose={() => setShowPopup(false)} />
            )}

            {/* Activity Modal */}
            {selectedActivityComponent && (
                <ActivityModal
                    activityComponent={selectedActivityComponent}
                    onClose={() => setSelectedActivityComponent(null)}
                />
            )}

            <header className="mb-10 border-b border-[#2A474A] pb-6">
                <h1 className="text-5xl font-extrabold text-white flex items-center gap-3">
                    <IoLeafOutline className={tealPrimary} size={40} />
                    <span className={tealPrimary}>Well-being</span> Activities Library
                </h1>
                <p className="mt-2 text-lg text-gray-400">
                    Explore curated exercises categorized by their focus area.
                </p>
            </header>
            
            {/* Activity Categories */}
            <div className="space-y-12">
                {Object.keys(categorizedActivities).map((category) => (
                    <section key={category}>
                        <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-teal-500 pl-4">
                            {category}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categorizedActivities[category].map((activity) => {
                                const isCompletedToday = todayLogs.includes(activity._id);
                                const IconComponent = activityMapping[activity.name]?.icon || IoLeafOutline;

                                return (
                                    <motion.div
                                        key={activity._id}
                                        whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className={`${cardBg} p-5 rounded-2xl shadow-xl transition border ${cardBorder} flex flex-col`}
                                    >
                                        <div className="flex items-center mb-3">
                                            <IconComponent className={`w-6 h-6 mr-2 ${tealPrimary}`} />
                                            <h3 className="text-xl font-bold text-teal-300">
                                                {activity.name}
                                            </h3>
                                        </div>

                                        <p className="text-gray-400 mb-4 text-sm flex-grow">{activity.description}</p>

                                        <button
                                            className={`mt-auto w-full py-3 rounded-xl font-semibold transition shadow-lg text-sm uppercase tracking-wider ${
                                                isCompletedToday ? buttonCompleted : buttonPrimary
                                            }`}
                                            onClick={() => !isCompletedToday && handleStartActivity(activity)}
                                            disabled={isCompletedToday}
                                        >
                                            {isCompletedToday ? "Completed Today ✅" : "Start Exercise"}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default ActivitiesPage;