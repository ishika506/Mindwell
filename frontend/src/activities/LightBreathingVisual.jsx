import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoRadioButtonOnOutline, IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";

const BREATH_CYCLE_DURATION = 4; // 4 seconds for Inhale, 4 for Exhale

const LightBreathingVisual = ({ onComplete }) => {
    const [phase, setPhase] = useState("Inhale"); // Inhale or Exhale

    // --- Theme Constants ---
    const primaryBg = "bg-[#0a1517]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40";

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase((prev) => (prev === "Inhale" ? "Exhale" : "Inhale"));
        }, BREATH_CYCLE_DURATION * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        // pl-[280px] to accommodate the fixed sidebar
        <div className={`min-h-screen ${primaryBg} text-gray-200 pl-[280px] pr-12 py-12 flex items-center justify-center overflow-hidden`}>
            
            {/* Ambient Background Light (Reacts to Phase) */}
            <motion.div 
                animate={{ 
                    scale: phase === "Inhale" ? 1.5 : 1,
                    opacity: phase === "Inhale" ? 0.15 : 0.05
                }}
                transition={{ duration: BREATH_CYCLE_DURATION, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-teal-500 rounded-full blur-[150px] z-0"
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg flex flex-col items-center"
            >
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
                        <IoRadioButtonOnOutline className="text-teal-400 animate-pulse" /> Flow
                    </h1>
                    <p className="text-gray-500 text-sm font-bold tracking-[0.4em] mt-2">BREATHING HARMONY</p>
                </header>

                {/* THE BREATHING ORB */}
                <div className="relative flex items-center justify-center w-80 h-80">
                    
                    {/* Layered Glow Rings */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: phase === "Inhale" ? [1, 1.2 + i * 0.2] : [1.2 + i * 0.2, 1],
                                opacity: phase === "Inhale" ? [0.1, 0.3, 0.1] : [0.1, 0.05, 0.1]
                            }}
                            transition={{ duration: BREATH_CYCLE_DURATION, ease: "easeInOut", repeat: Infinity }}
                            className="absolute inset-0 rounded-full border border-teal-500/30"
                        />
                    ))}

                    {/* Main Core Orb */}
                    <motion.div
                        animate={{
                            scale: phase === "Inhale" ? 1.4 : 0.8,
                            backgroundColor: phase === "Inhale" ? "#2dd4bf" : "#0f766e",
                            boxShadow: phase === "Inhale" 
                                ? "0 0 60px 20px rgba(45, 212, 191, 0.3)" 
                                : "0 0 20px 0px rgba(15, 118, 110, 0.1)"
                        }}
                        transition={{ duration: BREATH_CYCLE_DURATION, ease: "easeInOut" }}
                        className="w-40 h-40 rounded-full z-20 flex items-center justify-center relative"
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={phase}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-black font-black uppercase text-xs tracking-widest"
                            >
                                {phase}
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-gray-400 text-lg font-light italic max-w-xs mx-auto leading-relaxed">
                        "Focus on the light. Let your body sync with the rhythm of the universe."
                    </p>
                    
                    {/* Action Controls */}
                    <div className="mt-12 flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onComplete && onComplete()}
                            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 ${buttonPrimary}`}
                        >
                            <IoCheckmarkCircleOutline size={22} /> I Feel Balanced
                        </motion.button>
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
                        >
                            <IoCloseOutline size={26} />
                        </button>
                    </div>
                </div>

                <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mt-12 text-[10px] text-gray-600 font-bold tracking-[0.5em] uppercase"
                >
                    Syncing Nervous System...
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LightBreathingVisual;