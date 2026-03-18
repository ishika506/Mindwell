import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoBodyOutline, IoCheckmarkCircleOutline, IoPauseOutline, IoPlayOutline, IoStopCircleOutline, IoRefreshCircleOutline } from "react-icons/io5";

const PHASE_DURATIONS = {
    FREEZE: 5, // Tense for 5 seconds
    RELAX: 10, // Relax for 10 seconds (longer than tense)
};
const TOTAL_CYCLES = 3; // Standard practice for PMR effectiveness

export default function FreezeRelax({ onComplete }) {
    const [phase, setPhase] = useState('ready'); // 'ready', 'freeze', 'relax', 'complete'
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [currentCycle, setCurrentCycle] = useState(0); // Tracks 0 to TOTAL_CYCLES

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const freezeColor = "text-red-400";
    const relaxColor = "text-green-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const buttonDone = "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-700/40";


    // --- Core Timer Logic ---
    useEffect(() => {
        if (!isActive || phase === 'ready' || phase === 'complete') return;

        const phaseDuration = phase === 'freeze' ? PHASE_DURATIONS.FREEZE : PHASE_DURATIONS.RELAX;
        setTimer(phaseDuration);
        
        const countdown = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    
                    if (phase === 'freeze') {
                        setPhase('relax');
                    } else if (phase === 'relax') {
                        // Cycle completed. Check if we need to start a new cycle.
                        if (currentCycle < TOTAL_CYCLES) {
                            setCurrentCycle(c => c + 1);
                            setPhase('freeze'); // Start next cycle
                        } else {
                            setIsActive(false); 
                            setPhase('complete'); // All cycles finished
                        }
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [phase, isActive, currentCycle]);


    const startActivity = () => {
        // Reset and start the first cycle
        setCurrentCycle(1); 
        setIsActive(true);
        setPhase('freeze');
    };
    
    const stopActivity = () => {
        setIsActive(false);
        setPhase('ready');
    };

    const handleFinish = () => {
        stopActivity();
        if (onComplete) onComplete();
    };

    // --- Dynamic Display Content ---
    const isReady = phase === 'ready';

    const renderAction = () => {
        if (isReady) {
            return (
                <div className="text-center">
                    <p className={`text-2xl font-extrabold ${highlightColor} mb-2`}>
                        Focus on Tensing and Releasing:
                    </p>
                    <p className="text-lg text-gray-400">
                        Follow the audio cues (imagine the audio if running standalone) to tighten, then completely relax, your muscles.
                    </p>
                    <p className="text-md text-gray-500 mt-4">
                        We will repeat the cycle {TOTAL_CYCLES} times.
                    </p>
                </div>
            );
        }
        
        if (phase === 'freeze') {
            return (
                <div className="text-center">
                    <p className={`text-4xl font-extrabold ${freezeColor} animate-pulse`}>
                        FREEZE! TENSE MUSCLES NOW.
                    </p>
                    <p className="text-lg text-white mt-2">Hold for {timer} seconds.</p>
                </div>
            );
        }

        if (phase === 'relax') {
            return (
                <div className="text-center">
                    <p className={`text-4xl font-extrabold ${relaxColor}`}>
                        RELAX. RELEASE ALL TENSION.
                    </p>
                    <p className="text-lg text-white mt-2">Release for {timer} seconds.</p>
                </div>
            );
        }
        
        if (phase === 'complete') {
            return (
                <div className="text-center">
                    <p className={`text-3xl font-extrabold ${relaxColor}`}>
                        SESSION COMPLETE!
                    </p>
                    <p className="text-xl text-white mt-2">Notice the feeling of deep relaxation in your body.</p>
                </div>
            );
        }
    };


    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-10 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoBodyOutline /> Progressive Muscle Relaxation (PMR)
            </h2>
            
            {/* Cycle Counter */}
            {phase !== 'ready' && (
                <div className={`mb-4 text-sm font-semibold ${highlightColor}`}>
                    Cycle: {Math.min(currentCycle, TOTAL_CYCLES)} / {TOTAL_CYCLES}
                </div>
            )}

            <motion.div
                key={phase}
                className={`${cardBg} p-10 rounded-3xl border border-[#2A474A] max-w-lg w-full shadow-2xl min-h-[300px] flex flex-col justify-center items-center`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 150 }}
            >
                {renderAction()}
                
                {/* Visual Timer Progress Bar */}
                {isActive && (
                    <motion.div
                        className="w-full h-2 rounded-full mt-6"
                        style={{ backgroundColor: phase === 'freeze' ? '#D9534F' : '#5CB85C' }}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ 
                            duration: phase === 'freeze' ? PHASE_DURATIONS.FREEZE : PHASE_DURATIONS.RELAX, 
                            ease: 'linear' 
                        }}
                    />
                )}
            </motion.div>

            {/* Controls */}
            <div className="mt-8 flex gap-4">
                
                {isReady && phase !== 'complete' && (
                    <motion.button
                        onClick={startActivity}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2`}
                    >
                        <IoPlayOutline size={22} /> Start {currentCycle > 0 ? "New Session" : "Activity"}
                    </motion.button>
                )}
                
                {isActive && (
                    <motion.button
                        onClick={stopActivity}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition-all flex items-center gap-2`}
                    >
                        <IoStopCircleOutline size={22} /> Stop Session
                    </motion.button>
                )}
                
                {phase === 'complete' && (
                    <motion.button
                        onClick={handleFinish}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 font-bold rounded-xl ${buttonDone} transition-all flex items-center gap-2`}
                    >
                        <IoCheckmarkCircleOutline size={22} /> Complete & Log
                    </motion.button>
                )}
            </div>
            
            {phase !== 'ready' && (
                <p className="mt-4 text-sm text-gray-500">
                    *The exercise automatically transitions between phases.
                </p>
            )}
        </div>
    );
}