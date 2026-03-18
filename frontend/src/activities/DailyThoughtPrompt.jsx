import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoCreateOutline, 
    IoSparklesOutline, 
    IoCheckmarkCircle, 
    IoLeafOutline,
    IoLockClosedOutline,
    IoArrowForward
} from "react-icons/io5";

const prompts = [
    "What made you smile today?",
    "What is one thing you're looking forward to tomorrow?",
    "Describe a moment where you felt at peace today.",
    "What is a small victory you achieved recently?",
    "Who is someone you're grateful for right now?",
    "What’s a challenge you handled better than you expected?"
];

const DailyThoughtPrompt = ({ onComplete }) => {
    const [thought, setThought] = useState("");
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // --- Theme Constants ---
    const primaryBg = "bg-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";

    useEffect(() => {
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        setCurrentPrompt(randomPrompt);
    }, []);

    const handleSubmit = async () => {
        if (!thought.trim()) return;
        setIsSaving(true);
        
        // Artificial delay for that "Premium Processing" feel
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (onComplete) onComplete(thought);
    };

    return (
        <div className={`min-h-screen ${primaryBg} text-gray-200 pl-[280px] pr-12 py-12 flex items-center justify-center relative overflow-hidden`}>
            
            {/* DYNAMIC AMBIENT GLOW: Scales and brightens based on input length */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: thought.length > 0 ? 0.2 : 0.05,
                    backgroundColor: thought.length > 50 ? "#2dd4bf" : "#0f766e"
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute w-[800px] h-[800px] blur-[150px] rounded-full z-0"
            />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-3xl"
            >
                {/* Header Section */}
                <div className="flex items-end justify-between mb-8 px-4">
                    <div>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 text-teal-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2"
                        >
                            <IoLeafOutline /> Daily Sanctuary Entry
                        </motion.div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Reflect & <span className={highlightColor}>Release</span>
                        </h1>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-gray-600 text-xs font-mono">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                <div className={`${cardBg} rounded-[48px] p-2 border border-white/5 shadow-2xl relative overflow-hidden`}>
                    
                    <AnimatePresence mode="wait">
                        {!isSaving ? (
                            <motion.div
                                key="writing-state"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-8 md:p-12"
                            >
                                {/* The Prompt Area */}
                                <div className="mb-10">
                                    <h2 className="text-2xl md:text-3xl font-medium text-gray-300 leading-snug">
                                        {currentPrompt}
                                    </h2>
                                </div>

                                {/* Cinematic Textarea */}
                                <textarea
                                    autoFocus
                                    value={thought}
                                    onChange={(e) => setThought(e.target.value)}
                                    placeholder="Start writing..."
                                    className="w-full h-64 bg-transparent border-none text-xl md:text-2xl text-white placeholder:text-gray-800 focus:ring-0 resize-none leading-relaxed font-light italic"
                                />

                                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Character Count</span>
                                            <span className={`text-sm font-mono ${thought.length > 0 ? 'text-teal-400' : 'text-gray-700'}`}>
                                                {thought.length.toString().padStart(3, '0')}
                                            </span>
                                        </div>
                                        <div className="h-8 w-[1px] bg-white/5" />
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <IoLockClosedOutline size={14} />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Private Entry</span>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        disabled={!thought.trim()}
                                        className={`group px-10 py-5 rounded-3xl font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                                            thought.trim() 
                                                ? "bg-teal-500 text-[#0a1517] shadow-xl shadow-teal-500/20" 
                                                : "bg-gray-800 text-gray-600 cursor-not-allowed opacity-50"
                                        }`}
                                    >
                                        Save Reflection <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="saving-state"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-32 flex flex-col items-center justify-center text-center"
                            >
                                <motion.div
                                    animate={{ 
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="mb-8 text-teal-500"
                                >
                                    <IoSparklesOutline size={64} />
                                </motion.div>
                                <h2 className="text-3xl font-black text-white mb-2">ARCHIVING</h2>
                                <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Storing your thought in the sanctuary...</p>
                                
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: 200 }}
                                    transition={{ duration: 1.2 }}
                                    className="h-1 bg-teal-500 mt-8 rounded-full"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Quote */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-600 italic text-sm">
                        "Writing is the geometry of the soul."
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DailyThoughtPrompt;