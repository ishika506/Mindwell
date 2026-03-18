import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
    IoLeafOutline, 
    IoTimeOutline, 
    IoCheckmarkCircleOutline, 
    IoPauseOutline, 
    IoPlayOutline, 
    IoStopCircleOutline 
} from "react-icons/io5";

const BREATH_DURATION = 5; // 5 seconds per phase (Inhale, Exhale)
const INITIAL_SESSION_DURATION_SECONDS = 120; // 2 minutes total session

export default function StarfishBreathing({ onComplete, duration = INITIAL_SESSION_DURATION_SECONDS }) {
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
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const buttonDone = "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-700/40";
    const breathingCircleColor = "bg-teal-700/50";


    // --- 1. Session Timer & Phase Cycling Logic ---
    useEffect(() => {
        // Clear all timers on cleanup
        return () => {
            if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
            if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (!isActive || phase === 'finished') {
            if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
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

        return () => {
            // No cleanup needed inside this function as it is handled by the initial useEffect return.
        };
    }, [isActive, phase]);


    // --- Controls and Utils ---
    const formatTime = (sec) => `${Math.floor(sec / 60)}:${("0" + (sec % 60)).slice(-2)}`;

    const startBreathing = () => {
        if (timeLeft > 0) {
            setIsActive(true);
            setPhase('inhale');
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

    // --- Dynamic Display ---
    let instructionText = "Press Play to begin guided breathing.";
    let instructionStyle = "text-gray-400";
    let isTicking = false;

    if (phase === 'inhale') {
        instructionText = "🌬 INHALE (5 SECONDS)";
        instructionStyle = inhaleColor;
        isTicking = true;
    } else if (phase === 'exhale') {
        instructionText = "😮‍💨 EXHALE (5 SECONDS)";
        instructionStyle = exhaleColor;
        isTicking = true;
    } else if (phase === 'finished') {
        instructionText = "Session Complete!";
        instructionStyle = "text-green-400";
    }

    // Framer Motion Variants for the breathing circle
    const breathingVariants = {
        inhale: { 
            scale: 1.2, 
            opacity: 1, 
            transition: { duration: BREATH_DURATION, ease: "easeInOut" } 
        },
        exhale: { 
            scale: 0.8, 
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
                <IoLeafOutline /> Guided Breath Cycle
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-sm text-center">
                Focus on the circle. Trace your fingers (or look at the screen) while breathing.
            </p>

            {/* Breathing Circle Visual Cue */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <motion.div
                    className={`w-full h-full rounded-full ${breathingCircleColor} shadow-xl border-4 border-teal-400/50`}
                    variants={breathingVariants}
                    animate={isActive ? phase : 'ready'}
                />
                <div className={`absolute text-center font-extrabold ${isTicking ? 'text-white' : 'text-gray-300'}`}>
                    {isTicking && <p className="text-5xl">{BREATH_DURATION}s</p>}
                    <p className="text-sm uppercase tracking-widest">{phase}</p>
                </div>
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
                {!isActive && timeLeft > 0 ? (
                    <motion.button
                        onClick={startBreathing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={phase === 'finished'}
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
                    You completed the breathing exercise!
                </motion.p>
            )}

        </motion.div>
    );
}