import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
    IoWalkOutline, 
    IoCheckmarkCircleOutline, 
    IoPauseOutline, 
    IoPlayOutline, 
    IoTimeOutline 
} from "react-icons/io5";

const stretchingSteps = [
    { name: "Reach Up Stretch", duration: 8, icon: '⬆️', instruction: "Reach both arms high above your head, stretching tall." },
    { name: "Standing Forward Fold", duration: 10, icon: '🤸', instruction: "Gently fold forward to touch your toes or shins." },
    { name: "Side Body Stretch", duration: 8, icon: '↔️', instruction: "Lean to the left, then to the right, opening the sides of your body." },
    { name: "Shoulder Rolls", duration: 6, icon: '🔄', instruction: "Roll your shoulders slowly backwards, then forwards." },
    { name: "Gentle Neck Roll", duration: 8, icon: '🧘', instruction: "Slowly tilt your head, rotating side to side." },
];
const TOTAL_STEPS = stretchingSteps.length;

export default function StretchAlong({ onComplete }) {
    const [step, setStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const timerRef = useRef(null); 
    
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

        if (isActive && step < TOTAL_STEPS) {
            
            // Start the countdown
            timerRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        
                        if (step < TOTAL_STEPS - 1) {
                            setStep(s => s + 1);
                            // Reset timer for the next step's duration
                            return stretchingSteps[step + 1].duration;
                        } else {
                            // Sequence completed
                            setIsActive(false);
                            setStep(TOTAL_STEPS); // Mark as finished
                            setTimeout(onComplete, 1000); // Wait for animation before logging
                            return 0;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // Initialize timer display for the new step if we just moved forward
        if (isActive && secondsLeft === 0 && step < TOTAL_STEPS) {
             setSecondsLeft(stretchingSteps[step].duration);
        }

        // Cleanup function
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, step, onComplete, secondsLeft]); // Include secondsLeft to trigger re-run when time hits 0


    // --- Controls and State Management ---
    const startSession = () => {
        if (step === TOTAL_STEPS) {
            // Restart if finished
            setStep(0);
        }
        // Set the timer duration if starting fresh or resuming from a full pause
        if (secondsLeft === 0 || step === 0) {
            setSecondsLeft(stretchingSteps[step].duration);
        }
        setIsActive(true);
    };

    const togglePause = () => {
        setIsActive(prev => !prev);
    };
    
    const handleFinish = () => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
        // Force completion status if finishing early
        if (step < TOTAL_STEPS) setStep(TOTAL_STEPS);
        if (onComplete) onComplete();
    };

    const isFinished = step >= TOTAL_STEPS;
    const currentStepData = stretchingSteps[Math.min(step, TOTAL_STEPS - 1)];
    const fullDuration = stretchingSteps[Math.min(step, TOTAL_STEPS - 1)].duration;
    
    // Framer Motion Variants for step text
    const stepVariants = {
        pulse: { 
            scale: [1, 1.03, 1], 
            opacity: [1, 0.95, 1],
            transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
        },
        initial: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 }
    };
    
    // Framer Motion Progress Bar Keyframes (Tracks from 100% down to 0%)
    const progressBarKeyframes = {
        // We use keyframes to smoothly animate from the current `secondsLeft` position
        // to 0%, ensuring it doesn't jump back to 100% on pause/resume.
        initial: { width: `${(secondsLeft / fullDuration) * 100}%` }, 
        animate: { 
            width: "0%", 
            transition: { duration: secondsLeft, ease: "linear" } 
        },
        pause: { 
            width: `${(secondsLeft / fullDuration) * 100}%`,
            transition: { duration: 0.1 }
        }
    };


    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-10 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoWalkOutline /> Guided Stretch Along
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
                <div className="text-6xl mb-4">{currentStepData.icon}</div>
                
                {/* Step Instruction */}
                <p className={`text-3xl font-extrabold ${movementColor}`}>
                    {isFinished ? "✅ Session Complete!" : currentStepData.name}
                </p>
                <p className="text-lg text-gray-400 mt-2 italic">
                    {currentStepData.instruction}
                </p>
            </motion.div>
            
            {/* Timer and Progress */}
            {!isFinished && (
                <div className="w-full max-w-md mt-4">
                    <p className="text-lg text-gray-300 font-bold mb-2 flex items-center justify-between">
                        <span><IoTimeOutline className="inline mr-1" /> Step {step + 1} of {TOTAL_STEPS}</span>
                        <span className={movementColor}>{secondsLeft} seconds</span>
                    </p>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-orange-500 rounded-full"
                            // Animate the bar when active
                            variants={progressBarKeyframes}
                            initial={false} // Use false to correctly pick up the initial width from state
                            animate={isActive ? "animate" : "pause"}
                            key={step + secondsLeft} // Key change ensures the animation resets correctly on step change and starts correctly after pause
                        />
                    </div>
                </div>
            )}
            
            {/* Controls */}
            <div className="mt-10 flex gap-4">
                
                {/* Play/Pause Button */}
                {!isActive && !isFinished ? (
                    <motion.button
                        onClick={startSession}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2`}
                    >
                        <IoPlayOutline size={22} /> {secondsLeft > 0 ? "Resume" : "Start Stretching"}
                    </motion.button>
                ) : isActive ? (
                    <motion.button
                        onClick={togglePause}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl ${buttonPause} transition-all flex items-center gap-2`}
                    >
                        <IoPauseOutline size={22} /> Pause
                    </motion.button>
                ) : null}
                
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
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 text-xl font-bold text-green-400"
                >
                    Great job completing the full stretching routine!
                </motion.p>
            )}
        </div>
    );
}