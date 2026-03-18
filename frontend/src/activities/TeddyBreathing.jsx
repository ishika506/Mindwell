import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
    IoLeafOutline, 
    IoTimeOutline, 
    IoCheckmarkCircleOutline, 
    IoPauseOutline, 
    IoPlayOutline,
    IoRefreshCircleOutline 
} from "react-icons/io5";

const BREATH_DURATION = 4; // 4 seconds per phase (Inhale, Exhale)
const INITIAL_SESSION_DURATION_SECONDS = 180; // 3 minutes total session

export default function TeddyTummyBreathing({ duration = INITIAL_SESSION_DURATION_SECONDS, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [phase, setPhase] = useState("ready"); // 'ready', 'inhale', 'exhale', 'finished'
    const [isActive, setIsActive] = useState(false);
    
    const phaseTimeoutRef = useRef(null);
    const sessionIntervalRef = useRef(null);
    
    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const highlightColor = "text-teal-400";
    const inhaleColor = "text-green-400";
    const exhaleColor = "text-yellow-400";
    const breathingCircleColor = "bg-pink-600/50"; // Using pink/orange tone for the teddy visual
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const buttonDone = "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-700/40";
    const buttonSecondary = "bg-gray-600 hover:bg-gray-500 text-white";


    // --- 1. Cleanup ---
    useEffect(() => {
        return () => {
            if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
            if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
        };
    }, []);

    // --- 2. Session Timer & Phase Cycling Logic ---
    useEffect(() => {
        if (!isActive || phase === 'finished') {
            if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
            if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
            sessionIntervalRef.current = null;
            return;
        }

        // --- Session Countdown ---
        if (!sessionIntervalRef.current) {
            sessionIntervalRef.current = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        clearInterval(sessionIntervalRef.current);
                        setPhase('finished');
                        setIsActive(false);
                        if (onComplete) onComplete();
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }

        // --- Phase Cycle Timeout ---
        if (phase !== 'ready') {
            if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
            
            phaseTimeoutRef.current = setTimeout(() => {
                const nextPhase = phase === 'inhale' ? 'exhale' : 'inhale';
                setPhase(nextPhase);
            }, BREATH_DURATION * 1000);
        }
    }, [isActive, phase, onComplete]);


    // --- Controls and Utils ---
    const formatTime = (sec) => `${Math.floor(sec / 60)}:${("0" + (sec % 60)).slice(-2)}`;

    const startBreathing = () => {
        if (timeLeft > 0) {
            // Only start the countdown interval if it's the very beginning
            if (timeLeft === duration) {
                setTimeLeft(duration - 1);
            } else if (timeLeft === 0) {
                // If attempting to resume after timer hit 0, do nothing or reset first.
                return;
            }
            
            setIsActive(true);
            // Ensure phase starts correctly
            if (phase === 'ready' || phase === 'finished') {
                setPhase('inhale');
            }
        }
    };

    const togglePause = () => {
        setIsActive(false);
    };

    const handleFinish = () => {
        setIsActive(false);
        setPhase('finished');
        if (onComplete) onComplete();
    };
    
    const handleReset = () => {
        setIsActive(false);
        setPhase('ready');
        setTimeLeft(duration);
        if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    };


    // --- Dynamic Display ---
    let instructionText = "Place hand on your belly and press Play.";
    let instructionStyle = "text-gray-400";
    let breathLabel = "";

    if (phase === 'inhale') {
        instructionText = `🌬 INHALE (4 SECONDS): Belly Rises.`;
        instructionStyle = inhaleColor;
        breathLabel = "IN";
    } else if (phase === 'exhale') {
        instructionText = `😮‍💨 EXHALE (4 SECONDS): Belly Falls.`;
        instructionStyle = exhaleColor;
        breathLabel = "OUT";
    } else if (phase === 'finished') {
        instructionText = "Session Complete!";
        instructionStyle = "text-green-400";
        breathLabel = "DONE";
    }

    // Framer Motion Variants for the breathing circle (simulates teddy/belly movement)
    const breathingVariants = {
        inhale: { 
            scale: 1.2, 
            opacity: 1, 
            transition: { duration: BREATH_DURATION, ease: "easeInOut" } 
        },
        exhale: { 
            scale: 0.9, 
            opacity: 0.8, 
            transition: { duration: BREATH_DURATION, ease: "easeInOut" } 
        },
        ready: { 
            scale: 1, 
            opacity: 1 
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}
        >
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-2 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoLeafOutline /> Diaphragmatic Breathing
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-sm text-center">
                Focus on moving your belly, not your chest. Watch the circle expand and contract.
            </p>

            {/* Breathing Circle Visual Cue */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                {/* Visual Cue Circle */}
                <motion.div
                    className={`w-full h-full rounded-full ${breathingCircleColor} shadow-xl border-4 border-pink-400/50`}
                    variants={breathingVariants}
                    animate={isActive ? phase : 'ready'}
                />
                
                {/* Text Prompt in Center */}
                <motion.div 
                    className="absolute text-center font-extrabold"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <p className="text-6xl" style={{ color: phase === 'inhale' ? '#9FEF00' : '#FFD700' }}>
                        {breathLabel}
                    </p>
                    <p className="text-sm uppercase tracking-widest text-white">
                        {isActive && phase !== 'finished' ? `${BREATH_DURATION} SEC` : ''}
                    </p>
                </motion.div>

            </div>

            {/* Instruction and Timer Display */}
            <motion.div
                key={phase}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center w-full max-w-sm p-4"
            >
                <p className={`text-2xl font-bold ${instructionStyle} min-h-[30px]`}>
                    {instructionText}
                </p>
                <div className={`text-lg font-extrabold mt-2 ${highlightColor}`}>
                    <IoTimeOutline className="inline mr-2" /> {formatTime(timeLeft)} left
                </div>
            </motion.div>


            {/* Controls */}
            <div className="mt-10 flex gap-4">
                
                {/* Play/Pause Button */}
                {!isActive && timeLeft > 0 && phase !== 'finished' ? (
                    <motion.button
                        onClick={startBreathing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2`}
                    >
                        <IoPlayOutline size={22} /> {phase === 'ready' ? "Start Session" : "Resume"}
                    </motion.button>
                ) : isActive ? (
                    <motion.button
                        onClick={togglePause}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition-all flex items-center gap-2`}
                    >
                        <IoPauseOutline size={22} /> Pause
                    </motion.button>
                ) : null}

                {/* Reset Button */}
                {phase !== 'ready' && (
                    <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-3 font-bold rounded-xl ${buttonSecondary} transition-all flex items-center gap-2`}
                    >
                        <IoRefreshCircleOutline size={22} /> Reset
                    </motion.button>
                )}

                {/* Finish Button */}
                <motion.button
                    onClick={handleFinish}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={phase === 'finished'}
                    className={`px-8 py-3 font-bold rounded-xl ${buttonDone} transition-all flex items-center gap-2`}
                >
                    <IoCheckmarkCircleOutline size={22} /> Finish
                </motion.button>
            </div>
            
            {phase === 'finished' && (
                <motion.p
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 text-xl font-bold text-green-400"
                >
                    You completed the full breathing exercise!
                </motion.p>
            )}

        </motion.div>
    );
}