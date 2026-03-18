import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
    IoWalkOutline, 
    IoCheckmarkCircleOutline, 
    IoPlayOutline, 
    IoPauseOutline, 
    IoTimeOutline,
    IoStopCircleOutline
} from "react-icons/io5";

const steps = [
    { text: "Shake the tension out of your left arm!", duration: 4, icon: '👈' },
    { text: "Shake the tension out of your right arm!", duration: 4, icon: '👉' },
    { text: "Jump up and down lightly!", duration: 5, icon: '🤸' },
    { text: "Wiggle your whole body!", duration: 6, icon: '🕺' },
    { text: "Spin slowly once and stop!", duration: 3, icon: '🔄' },
];

export default function ShakeItOut({ onComplete }) {
    const [step, setStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const timerRef = useRef(null); // Ref to hold the countdown interval
    const totalSteps = steps.length;

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const highlightColor = "text-teal-400";
    const movementColor = "text-orange-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const buttonPause = "bg-gray-500 hover:bg-gray-600 text-white";
    const buttonDone = "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-700/40";

    // --- Core Timer Logic ---
    useEffect(() => {
        // Clear any existing timer when starting or pausing
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (isActive && step < totalSteps) {
            // Start the countdown
            timerRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        // Move to the next step
                        if (step < totalSteps - 1) {
                            setStep(s => s + 1);
                            // Reset timer for the next step's duration
                            return steps[step + 1].duration;
                        } else {
                            // Sequence completed
                            setIsActive(false);
                            setTimeout(onComplete, 1500);
                            return 0;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, step, totalSteps, onComplete]);
    
    // --- Initialize/Resume State ---
    const startSession = () => {
        if (step === totalSteps) {
            // If finished, restart
            setStep(0);
            setSecondsLeft(steps[0].duration);
        } else if (!isActive && secondsLeft === 0) {
            // Initial start
            setSecondsLeft(steps[step].duration);
        }
        setIsActive(true);
    };

    const togglePause = () => {
        setIsActive(prev => !prev);
    };
    
    const handleFinish = () => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (onComplete) onComplete();
    };

    const isFinished = step >= totalSteps;
    const currentStepData = steps[Math.min(step, totalSteps - 1)];
    const currentStepText = isFinished ? "✅ Movement Complete!" : currentStepData.text;
    const currentStepIcon = isFinished ? '🎉' : currentStepData.icon;
    
    // Framer Motion Variants for step text (energetic pulse)
    const stepVariants = {
        pulse: { 
            scale: [1, 1.03, 1], 
            opacity: [1, 0.95, 1],
            transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
        },
        initial: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-10 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoWalkOutline /> Energetic Shake Out
            </h2>
            
            <motion.div 
                key={step} 
                initial="initial"
                animate={isActive && !isFinished ? "pulse" : "initial"}
                exit="exit"
                variants={stepVariants}
                className="text-center mb-8 max-w-md w-full"
            >
                {/* Step Icon */}
                <div className="text-6xl mb-4">{currentStepIcon}</div>
                
                {/* Step Instruction */}
                <p className={`text-3xl font-extrabold ${movementColor}`}>
                    {currentStepText}
                </p>
            </motion.div>
            
            {/* Timer Display */}
            {!isFinished && (
                <div className="w-full max-w-md mt-4 text-center">
                    <p className="text-lg text-gray-300 font-bold mb-2">
                        {isActive ? (
                            <span className={secondsLeft <= 3 ? 'text-red-400' : highlightColor}>
                                {secondsLeft} seconds left
                            </span>
                        ) : (
                            <span className="text-gray-400">PAUSED</span>
                        )}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center justify-center">
                        <IoTimeOutline className="mr-1" /> Step {step + 1} of {totalSteps}
                    </p>
                </div>
            )}
            
            {/* Controls */}
            <div className="mt-10 flex gap-4">
                
                {/* Play/Pause Button */}
                <motion.button
                    onClick={!isActive ? startSession : togglePause}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isFinished}
                    className={`px-8 py-3 font-bold rounded-xl transition-all flex items-center gap-2 ${
                        isActive ? buttonPause : buttonPrimary
                    }`}
                >
                    {!isActive && !isFinished ? (
                        <>
                            <IoPlayOutline size={22} /> {secondsLeft > 0 ? "Resume" : "Start Session"}
                        </>
                    ) : (
                        <>
                            <IoPauseOutline size={22} /> Pause
                        </>
                    )}
                </motion.button>
                
                {/* Finish/Done Button */}
                <motion.button
                    onClick={handleFinish}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-3 font-bold rounded-xl ${buttonDone} transition-all flex items-center gap-2`}
                >
                    <IoCheckmarkCircleOutline size={22} /> {isFinished ? "Log Activity" : "Finish Early"}
                </motion.button>
            </div>
            
            {isFinished && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-xl font-bold text-green-400"
                >
                    Great job completing the full sequence!
                </motion.p>
            )}
        </div>
    );
}