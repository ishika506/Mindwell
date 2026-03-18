import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoFootstepsOutline, 
    IoCheckmarkCircleOutline, 
    IoArrowForwardOutline,
    IoCompassOutline,
    IoEllipsisHorizontalOutline
} from "react-icons/io5";

const STEP_PHASES = [
    { label: "Lift Left", color: "from-teal-500 to-emerald-500", shadow: "shadow-teal-500/20" },
    { label: "Place Left", color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
    { label: "Lift Right", color: "from-blue-500 to-indigo-500", shadow: "shadow-blue-500/20" },
    { label: "Place Right", color: "from-indigo-500 to-blue-500", shadow: "shadow-indigo-500/20" }
];

const SlowBalanceWalk = ({ onComplete }) => {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [totalCycles, setTotalCycles] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // --- Theme Constants ---
    const primaryBg = "bg-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";

    const nextPhase = () => {
        if (phaseIndex === STEP_PHASES.length - 1) {
            setTotalCycles(prev => prev + 1);
            setPhaseIndex(0);
        } else {
            setPhaseIndex(prev => prev + 1);
        }
    };

    const current = STEP_PHASES[phaseIndex];

    return (
        <div className={`min-h-screen ${primaryBg} text-gray-200 pl-[280px] pr-12 py-12 flex items-center justify-center overflow-hidden relative`}>
            
            {/* DYNAMIC AMBIENT ATMOSPHERE */}
            <motion.div 
                animate={{ 
                    x: phaseIndex % 2 === 0 ? -50 : 50,
                    opacity: [0.05, 0.1, 0.05]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent z-0"
            />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-2xl flex flex-col items-center"
            >
                {/* Header with Navigational Icon */}
                <header className="text-center mb-16">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4 text-teal-500 opacity-40"
                    >
                        <IoCompassOutline size={48} />
                    </motion.div>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
                        The Path <span className={highlightColor}>Flow</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] font-bold tracking-[0.6em] mt-2 uppercase">Proprioception Training</p>
                </header>

                {/* THE BALANCE HORIZON VISUALIZER */}
                <div className="relative w-80 h-80 flex items-center justify-center mb-16">
                    
                    {/* Floating Level Indicator (Moves Left/Right) */}
                    <motion.div
                        animate={{ x: phaseIndex < 2 ? -40 : 40 }}
                        transition={{ type: "spring", stiffness: 50, damping: 10 }}
                        className="absolute h-[2px] w-64 bg-white/10"
                    >
                        <motion.div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />
                    </motion.div>

                    {/* Step Rings */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={phaseIndex}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            className={`w-56 h-56 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center`}
                        >
                            <motion.div 
                                className={`w-40 h-40 rounded-full bg-gradient-to-br ${current.color} ${current.shadow} flex flex-col items-center justify-center text-black shadow-2xl relative`}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <IoFootstepsOutline size={54} />
                                </motion.div>
                                <span className="text-[10px] font-black uppercase tracking-widest mt-2">{current.label}</span>
                                
                                {/* Pulse Effect */}
                                <motion.div 
                                    animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full border-2 border-white/50"
                                />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* INTERACTIVE CONTROLS */}
                <div className="w-full max-w-sm flex flex-col gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={nextPhase}
                        className={`group py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${buttonPrimary}`}
                    >
                        Complete {current.label} <IoArrowForwardOutline className="group-hover:translate-x-2 transition-transform" />
                    </motion.button>

                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between px-6">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cycles</span>
                            <span className="text-xl font-mono text-white">{totalCycles}</span>
                        </div>
                        <motion.button
                            onClick={() => onComplete && onComplete(totalCycles)}
                            className="bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            Finish
                        </motion.button>
                    </div>
                </div>

                {/* Progress Indicators (Dots) */}
                <div className="mt-12 flex gap-3">
                    {STEP_PHASES.map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ 
                                scale: i === phaseIndex ? 1.5 : 1,
                                backgroundColor: i === phaseIndex ? "#2dd4bf" : "#2A474A"
                            }}
                            className="w-2 h-2 rounded-full"
                        />
                    ))}
                </div>

                <p className="mt-8 text-gray-600 text-[10px] font-bold tracking-[0.4em] uppercase">
                    Focused Kinetic Awareness
                </p>
            </motion.div>
        </div>
    );
};

export default SlowBalanceWalk;