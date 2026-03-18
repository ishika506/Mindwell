import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoColorPaletteOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

export default function ColorCalmMaze({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isTracing, setIsTracing] = useState(false);
    
    // SVG Constants for the circle path
    const RADIUS = 40;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const highlightFill = "#4FB3BF";
    const ringColor = "#06B6D4"; 
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    
    // --- State for the SVG dash offset based on progress ---
    const dashOffset = CIRCUMFERENCE * (1 - progress / 100);

    // --- Handle Interaction (Simulates tracing) ---
    const handleMove = () => {
        if (!isComplete) {
            setIsTracing(true);
            // Increase progress slowly on movement (slower increments require more effort/focus)
            setProgress(p => Math.min(100, p + 0.35)); 
        }
    };
    
    const handleMouseLeave = () => {
        setIsTracing(false);
    };

    // --- Check Completion ---
    useEffect(() => {
        if (progress >= 100 && !isComplete) {
            setIsComplete(true);
        }
    }, [progress, isComplete]);

    // Framer Motion Variants for "Shake" on completion
    const shakeVariants = {
        shake: { 
            x: [0, -5, 5, -5, 5, 0], 
            transition: { duration: 0.5, type: 'spring' } 
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>

            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-2 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoColorPaletteOutline /> Mindful Tracing Meditation
            </h2>
            <p className="text-lg italic text-gray-400 mb-8 max-w-lg text-center">
                Use your cursor/finger to trace the circle path continuously while taking slow, deep breaths.
            </p>

            {/* Tracing Area Container (The large circular area) */}
            <motion.div
                className={`w-96 h-96 rounded-full ${cardBg} shadow-2xl relative overflow-hidden flex items-center justify-center`}
                onMouseMove={handleMove}
                onTouchMove={handleMove} 
                onMouseLeave={handleMouseLeave}
                onTouchEnd={handleMouseLeave}
                initial={false}
                animate={isComplete ? "shake" : "default"}
                variants={shakeVariants}
            >
                {/* 1. SVG Circle Path */}
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle 
                        cx="50" cy="50" r={RADIUS} 
                        fill="none" 
                        stroke="#2A474A" // Dark grey background track
                        strokeWidth="5"
                    />
                    
                    {/* Animated Progress Stroke */}
                    <motion.circle 
                        cx="50" cy="50" r={RADIUS} 
                        fill="none" 
                        stroke={ringColor} 
                        strokeWidth="5"
                        strokeDasharray={CIRCUMFERENCE}
                        // Bind dashOffset to the React state
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        // Rotate to start the trace at the top (12 o'clock)
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                    />
                </svg>
                
                {/* 2. Instruction/Status Center */}
                <div className="relative text-center text-white p-4 z-10">
                    <IoColorPaletteOutline size={40} className={`mx-auto mb-2 ${isComplete ? "text-green-400" : highlightColor}`} />
                    <p className="font-extrabold text-2xl">
                        {isComplete ? (
                            "TRACING COMPLETE"
                        ) : (
                            "START TRACING"
                        )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {!isComplete && (isTracing ? "Focus on the line..." : "Click and begin movement")}
                    </p>
                </div>
            </motion.div>

            {/* Progress / Status Bar */}
            <div className="mt-8 w-full max-w-md">
                {/* Simple Horizontal Bar for Numeric Feedback */}
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${highlightFill}, #B6F2DD)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                    />
                </div>
                <p className="mt-2 text-md font-semibold text-white text-right">
                    Progress: <span className={isComplete ? "text-green-400" : highlightColor}>
                        {Math.round(progress)}%
                    </span>
                </p>
            </div>


            {/* Done Button */}
            <motion.button
                onClick={onComplete}
                disabled={!isComplete}
                whileHover={{ scale: isComplete ? 1.05 : 1 }}
                whileTap={{ scale: isComplete ? 0.95 : 1 }}
                className={`mt-10 px-10 py-4 font-bold rounded-xl transition-all flex items-center gap-2 text-lg uppercase tracking-wider ${
                    isComplete ? buttonPrimary : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
                <IoCheckmarkCircleOutline size={22} /> Finish Session
            </motion.button>
        </div>
    );
}