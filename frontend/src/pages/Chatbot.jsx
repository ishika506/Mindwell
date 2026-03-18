import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    IoChatbubbleEllipsesOutline,
    IoCheckmarkCircleOutline,
    IoPlayCircleOutline,
    IoSyncOutline,
    IoStarOutline,
    IoBulbOutline, // New icon for benefit list polish
    IoShieldCheckmarkOutline // New icon for privacy polish
} from "react-icons/io5";

// Constants for the external Chatbase widget
const CHATBASE_ID = "FwPWFvvCMMNFwvrd46ATY";
const CHATBASE_DOMAIN = "www.chatbase.co";
const NAVIGATION_DELAY = 1200; // 1.2 second delay for transition feel

const Chatbot = ({ todayGoal }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isCompleting, setIsCompleting] = useState(false); // Loading state

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0a1517] to-[#0e2124]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const instructionColor = "text-orange-400";
    const cardBg = "bg-[#152D30]";

    // --- 1. Chatbase Widget Loader & Cleanup ---
    useEffect(() => {
        const loadChatbase = () => {
            if (!window.chatbase || window.chatbase("getState") !== "initialized") {
                const script = document.createElement("script");
                script.src = `https://${CHATBASE_DOMAIN}/embed.min.js`;
                script.id = CHATBASE_ID;
                script.domain = CHATBASE_DOMAIN;
                script.async = true;

                script.onload = () => {
                     if (window.chatbase) {
                         try { window.chatbase("close"); } catch (e) { /* silent fail */ }
                     }
                };
                
                document.body.appendChild(script);
            }
        };

        const loadTimeout = setTimeout(loadChatbase, 100); 

        return () => {
            clearTimeout(loadTimeout);
            if (window.chatbase) { try { window.chatbase("close"); } catch {} }
            
            const scriptTag = document.getElementById(CHATBASE_ID);
            if (scriptTag && scriptTag.parentNode) scriptTag.parentNode.removeChild(scriptTag);
            
            const iframe = document.querySelector("iframe[src*='chatbase']");
            if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
            
            const launcher = document.querySelector(`[id^='chatbase-launcher']`); 
            if (launcher && launcher.parentNode) launcher.parentNode.removeChild(launcher);
            
            if (window.chatbase) delete window.chatbase;
        };
    }, []);

    // --- 2. End Chat & Mark chatCompleted ---
    const endChat = async () => {
        if (isCompleting) return;
        setIsCompleting(true);

        try {
            await API.post("/today-goal/complete", { type: "chat" });
        } catch (err) {
            console.error("Failed to complete chat:", err.response?.data || err);
        }

        setTimeout(() => {
            if (window.chatbase) try { window.chatbase("close"); } catch {}
            navigate("/dashboard");
        }, NAVIGATION_DELAY);
    };

    // Framer Motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

    return (
        // LAYOUT: pl-[280px] restores the sidebar offset
        <div className={`min-h-screen ${primaryBg} text-gray-200 relative pl-[280px] pr-12 py-12`}>
            {/* AMZING BACKGROUND OVERLAY: Subtle dark texture for depth */}
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,.1), rgba(0,0,0,.1) 1px, transparent 1px, transparent 5px)" }}></div>

            <div className="max-w-4xl mx-auto flex flex-col items-start relative z-10">
                
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
                    
                    <motion.h1 
                        variants={itemVariants} 
                        className="text-4xl font-extrabold flex items-center gap-2 mb-6"
                        style={{ color: highlightColor.replace('text-', '#') }}
                    >
                        <IoChatbubbleEllipsesOutline className="text-teal-400" /> AI Wellness Companion
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                        This is a calm, private space where you can share how you're feeling. 
                        Your companion listens without judgment and offers personalized support.
                    </motion.p>

                    {/* Instruction Box with Pulse Effect (Refined text flow) */}
                    <motion.div 
                        variants={itemVariants} 
                        className={`relative p-5 rounded-xl border border-teal-700/50 ${cardBg} max-w-lg shadow-2xl mb-10 overflow-hidden`}
                    >
                        {/* Pulse Effect */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 0.4, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-teal-800/20 rounded-xl pointer-events-none"
                        />

                        <p className={`text-xl font-bold ${instructionColor} flex items-center gap-2 mb-3 relative z-10`}>
                            <IoStarOutline size={28} /> Action Required to Start
                        </p>
                        <p className="text-gray-300 flex items-start relative z-10">
                            <motion.span 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className={`text-3xl ${instructionColor} mr-3 mt-[-5px]`}
                            >
                                ↙
                            </motion.span>
                            {/* Ensured the key instruction is clear and flows well */}
                            Click the **floating chat bubble icon** <span className={`font-semibold ${instructionColor} mx-1`}>in the bottom right corner</span> 
                            of your screen to begin your conversation with the AI.
                        </p>
                    </motion.div>
                    
                    {/* Benefits List (Improved Icons and Structure) */}
                    <motion.ul variants={containerVariants} className="space-y-3 text-gray-300 max-w-lg">
                        <motion.li variants={itemVariants} className="flex items-center gap-2">
                            <IoBulbOutline className="text-teal-400" size={20} /> Talk about stress, anxiety, or low mood.
                        </motion.li>
                        <motion.li variants={itemVariants} className="flex items-center gap-2">
                            <IoChatbubbleEllipsesOutline className="text-teal-400" size={20} /> Get grounding & personalized mindfulness guidance.
                        </motion.li>
                        <motion.li variants={itemVariants} className="flex items-center gap-2">
                            <IoStarOutline className="text-teal-400" size={20} /> Reflect safely and comfortably, at your own pace.
                        </motion.li>
                        <motion.li variants={itemVariants} className="flex items-center gap-2">
                            <IoShieldCheckmarkOutline className="text-teal-400" size={20} /> Conversation is fully private and supportive.
                        </motion.li>
                    </motion.ul>

                    {/* End Chat Button */}
                    <motion.button
                        variants={itemVariants}
                        onClick={endChat}
                        disabled={isCompleting || todayGoal?.chat?.completed}
                        whileHover={{ scale: isCompleting ? 1 : 1.03 }}
                        whileTap={{ scale: isCompleting ? 1 : 0.98 }}
                        className={`mt-10 px-8 py-4 font-bold rounded-xl transition-all flex items-center gap-2 uppercase tracking-wider ${
                            isCompleting 
                                ? "bg-green-700 text-white disabled:opacity-80" 
                                : todayGoal?.chat?.completed 
                                    ? "bg-gray-600 text-gray-400 disabled:cursor-not-allowed"
                                    : buttonPrimary
                        }`}
                    >
                        {todayGoal?.chat?.completed ? (
                             <span className="flex items-center"><IoCheckmarkCircleOutline size={22} className="mr-2" /> Goal Completed Today</span>
                        ) : isCompleting ? (
                            <span className="flex items-center">
                                <IoSyncOutline size={22} className="animate-spin mr-2" /> Finishing...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <IoCheckmarkCircleOutline size={22} /> Finished Reflection
                            </span>
                        )}
                    </motion.button>
                </motion.div>
                
            </div>
        </div>
    );
};

export default Chatbot;