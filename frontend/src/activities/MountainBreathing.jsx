import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoLeafOutline, IoCheckmarkCircleOutline, IoPauseOutline, IoPlayOutline } from "react-icons/io5";

const BREATHING_TIME_SECONDS = 4; // 4 seconds for Inhale, 4 seconds for Exhale
const FULL_CYCLE_DURATION = BREATHING_TIME_SECONDS * 2;
const MOUNTAIN_PATH_D = "M 0 130 L 150 20 L 300 130"; // The SVG path for the mountain shape

export default function MountainBreathing({ onComplete }) {
    const [phase, setPhase] = useState("ready"); // 'ready', 'inhale', 'exhale'
    const [isActive, setIsActive] = useState(false);
    const [timer, setTimer] = useState(BREATHING_TIME_SECONDS);
    const [cycleCount, setCycleCount] = useState(0); // Optional: track cycles completed

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const highlightColor = "text-teal-400";
    const breathUpColor = "text-green-400";
    const breathDownColor = "text-yellow-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const mountainTrackColor = "#2A474A";


    // --- Core Breathing Logic ---
    useEffect(() => {
        if (!isActive || phase === 'ready') return;

        // Reset timer at the start of a phase
        setTimer(BREATHING_TIME_SECONDS);
        
        const phaseDurationMs = BREATHING_TIME_SECONDS * 1000;

        // 1. Set the transition timeout for the phase change
        const phaseTimeout = setTimeout(() => {
            if (phase === "inhale") {
                setPhase("exhale");
            } else {
                setPhase("inhale");
                setCycleCount(c => c + 1); // Increment cycle after every full (exhale) cycle
            }
        }, phaseDurationMs);

        // 2. Set up the second-by-second countdown display
        const countdownInterval = setInterval(() => {
            setTimer(t => (t > 0 ? t - 1 : 0));
        }, 1000);

        return () => {
            clearTimeout(phaseTimeout);
            clearInterval(countdownInterval);
        };
    }, [phase, isActive]);


    const startBreathing = () => {
        setIsActive(true);
        setPhase("inhale");
        setCycleCount(0); // Reset cycles
    };

    const stopBreathing = () => {
        setIsActive(false);
        setPhase("ready");
    };

    const handleFinish = () => {
        stopBreathing();
        if (onComplete) onComplete();
    };

    // Determine current instruction and color
    let instruction = "Start the 4-second box breathing cycle.";
    let instructionColor = "text-gray-400";
    let isTicking = false;
    
    if (phase === "inhale") {
        instruction = `🌬 INHALE SLOWLY (Count: ${timer})`;
        instructionColor = breathUpColor;
        isTicking = true;
    } else if (phase === "exhale") {
        instruction = `😮‍💨 EXHALE SLOWLY (Count: ${timer})`;
        instructionColor = breathDownColor;
        isTicking = true;
    }
    
    // --- Framer Motion Variants for the Continuous Mountain Cycle ---
    const animationKey = phase === 'ready' ? 'ready' : (phase === 'inhale' ? 'inhale' : 'exhale');

    // Keyframes for continuous motion: 0 (bottom-left) -> 1 (peak) -> 0 (bottom-right)
    const mountainAnimation = {
        ready: { 
            pathLength: 0, 
            opacity: 0 
        },
        inhale: { 
            pathLength: [0, 1], // Start at 0, fill to 1 (up the mountain)
            opacity: 1,
            transition: { 
                duration: BREATHING_TIME_SECONDS, 
                ease: "easeInOut" // Smooth acceleration/deceleration
            } 
        },
        exhale: { 
            pathLength: [1, 0], // Start at 1, empty to 0 (down the mountain)
            opacity: 1,
            transition: { 
                duration: BREATHING_TIME_SECONDS, 
                ease: "easeInOut" 
            } 
        }
    };


    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>

            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-2 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoLeafOutline /> Mountain Breathing (4-Second Cycle)
            </h2>
            <p className="text-lg italic text-gray-400 mb-8 max-w-sm text-center">
                Synchronize your breath with the visual movement of the mountain path.
            </p>

            {/* Breathing SVG Container */}
            <div className="relative mb-8 p-4 rounded-3xl bg-[#152D30] border border-[#2A474A] shadow-xl">
                <svg width="300" height="150" viewBox="0 0 300 150">
                    {/* Background Track */}
                    <path
                        d={MOUNTAIN_PATH_D} 
                        stroke={mountainTrackColor}
                        strokeWidth="6"
                        fill="none"
                    />

                    {/* Animated Progress Stroke */}
                    <motion.path
                        d={MOUNTAIN_PATH_D}
                        stroke={phase === "inhale" ? breathUpColor.replace('text-', '#') : breathDownColor.replace('text-', '#')}
                        strokeWidth="6"
                        fill="none"
                        // Key props control the continuous, alternating animation
                        initial={animationKey} 
                        animate={animationKey}
                        variants={mountainAnimation}
                        key={animationKey} // Forces re-render and restart animation when phase changes
                    />
                </svg>
            </div>

            {/* Instruction Text */}
            <motion.p
                className={`text-2xl font-semibold mt-6 uppercase tracking-wider ${instructionColor} min-h-[40px]`}
                animate={{ scale: isTicking ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                {instruction}
            </motion.p>
            
            {/* Cycle Counter (Optional) */}
            {cycleCount > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                    Cycles completed: {cycleCount}
                </p>
            )}

            {/* Controls */}
            <div className="mt-10 flex gap-4">
                
                {!isActive ? (
                    <motion.button
                        onClick={startBreathing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2`}
                    >
                        <IoPlayOutline size={22} /> Start Breathing
                    </motion.button>
                ) : (
                    <motion.button
                        onClick={stopBreathing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition-all flex items-center gap-2`}
                    >
                        <IoPauseOutline size={22} /> Stop Session
                    </motion.button>
                )}
                
                <motion.button
                    onClick={handleFinish}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-3 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2`}
                >
                    <IoCheckmarkCircleOutline size={22} /> Done
                </motion.button>
            </div>
            
            <p className="mt-4 text-sm text-gray-600">
                Tip: Breathe deeply through your nose and out through your mouth.
            </p>
        </div>
    );
}