import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircleOutline, IoHappyOutline } from "react-icons/io5";

export default function CalmCounting({ onComplete }) {
    const initialBubbles = Array.from({ length: 10 }, (_, i) => i + 1);
    const [bubbles, setBubbles] = useState(initialBubbles);
    const totalBubbles = initialBubbles.length;

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const bubbleColor = "bg-teal-500 text-white";

    // --- Function to Pop a Bubble ---
    const popBubble = (num) => {
        // Use functional state update to ensure correct length check
        setBubbles((prev) => {
            const newBubbles = prev.filter((b) => b !== num);
            
            // Check if the last bubble was popped
            if (newBubbles.length === 0 && onComplete) {
                // Delay completion slightly to allow the final bubble pop animation to finish
                setTimeout(onComplete, 500); 
            }
            return newBubbles;
        });
    };

    // --- Framer Motion Variants ---
    const bubbleVariants = {
        initial: { scale: 1, opacity: 1 },
        exit: { 
            scale: 1.5, 
            opacity: 0, 
            transition: { duration: 0.3, ease: "easeOut" } 
        },
        tap: { scale: 0.85, transition: { duration: 0.1 } }
    };
    
    // --- Current Progress ---
    const poppedCount = totalBubbles - bubbles.length;

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-4 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoHappyOutline /> Calm Counting (Pop Bubbles)
            </h2>
            
            <p className="text-lg text-gray-400 mb-8 text-center max-w-sm">
                Focus on your breath: **Pop a bubble** each time you breathe **out** to anchor your attention.
            </p>
            
            {/* Progress Display */}
            <div className={`text-2xl font-bold mb-8 p-3 rounded-lg ${highlightColor} ${cardBg} border border-[#2A474A]`}>
                Popped: {poppedCount} / {totalBubbles}
            </div>

            {/* Bubble Grid */}
            <div className="flex flex-wrap gap-4 justify-center w-full max-w-md p-6 rounded-2xl border border-[#2A474A] shadow-inner bg-[#102325]">
                <AnimatePresence>
                    {bubbles.map((num) => (
                        <motion.div
                            key={num}
                            variants={bubbleVariants}
                            initial="initial"
                            exit="exit"
                            whileTap="tap"
                            onClick={() => popBubble(num)}
                            className={`w-14 h-14 flex items-center justify-center text-xl font-bold ${bubbleColor} rounded-full shadow-lg cursor-pointer transform transition-transform duration-300`}
                        >
                            {num}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {/* Finish Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-12 px-8 py-3 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2`}
                onClick={onComplete}
            >
                <IoCheckmarkCircleOutline size={20} /> Finish Session
            </motion.button>
        </div>
    );
}