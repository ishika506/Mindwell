import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircleOutline, IoHeartOutline } from "react-icons/io5";

const affirmations = [
    "I am safe.",
    "I am strong.",
    "I can handle this.",
    "I am proud of myself.",
    "I choose peace today.",
    "I accept myself completely.",
];

export default function AffirmationMirror({ onComplete }) {
    const [index, setIndex] = useState(0);

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";

    // --- Animation for text transition ---
    const textVariants = {
        enter: { opacity: 0, scale: 0.8, y: -20 },
        center: { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            transition: { 
                duration: 0.5, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100 
            } 
        },
        exit: { opacity: 0, scale: 0.8, y: 20 },
    };

    // Auto-looping logic
    useEffect(() => {
        const loop = setInterval(() => {
            setIndex((i) => (i + 1) % affirmations.length);
        }, 3500); // Time for focus
        return () => clearInterval(loop);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}
        >
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-12 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoHeartOutline /> Mindful Affirmation
            </h2>
            
            {/* Mirror/Card Display Area */}
            <div className={`relative w-full max-w-lg h-40 flex flex-col items-center justify-center rounded-3xl ${cardBg} shadow-2xl border border-[#2A474A] p-6`}>
                
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={index}
                        variants={textVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className={`absolute text-3xl md:text-4xl font-extrabold text-center text-white px-6`}
                    >
                        {affirmations[index]}
                    </motion.h1>
                </AnimatePresence>
                
                {/* Visual Accent */}
                <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-teal-900/50 pointer-events-none"></div>

            </div>
            
            <p className="mt-6 text-base text-gray-500 italic font-medium">
                — Look within and repeat these words with intention.
            </p>

            <motion.button
                onClick={onComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-20 px-10 py-4 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2 text-lg uppercase tracking-wider`}
            >
                <IoCheckmarkCircleOutline size={22} /> I've Reflected
            </motion.button>
        </motion.div>
    );
}