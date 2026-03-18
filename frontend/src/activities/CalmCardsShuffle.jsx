import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoShuffleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

const affirmations = [
    "You are doing your best 💛",
    "Pause. Breathe. Reset 🌱",
    "You are safe and strong ✨",
    "This feeling will pass 🌈",
    "Be gentle with yourself 🤍",
    "I am present in this moment 🕰️",
    "I release what I cannot control 🍃",
];

export default function CalmCardsShuffle({ onComplete }) {
    const [cardContent, setCardContent] = useState("Tap the card to reveal your calm message");
    const [isRevealed, setIsRevealed] = useState(false);
    const [key, setKey] = useState(0); // Key to trigger AnimatePresence exit/enter

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBackBg = "bg-teal-600 shadow-xl shadow-teal-900/50";
    const cardFrontBg = "bg-[#152D30] border border-teal-700/50";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";

    const revealCard = () => {
        const randomMessage = affirmations[Math.floor(Math.random() * affirmations.length)];
        
        // Use a slight delay to allow the flip animation to start before content changes
        if (isRevealed) {
            setIsRevealed(false);
            setKey(key + 1);
            setTimeout(() => {
                setCardContent(randomMessage);
                setIsRevealed(true);
            }, 300); // Wait for half the animation duration
        } else {
            setCardContent(randomMessage);
            setIsRevealed(true);
            setKey(key + 1);
        }
    };
    
    // --- Framer Motion Card Variants (Simple Flip/Scale) ---
    const cardVariants = {
        initial: { rotateY: 0, scale: 1 },
        flip: { rotateY: 360, scale: 1.05, transition: { duration: 0.6, type: "spring", stiffness: 100 } },
        tap: { scale: 0.95 },
    };

    const textVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { delay: 0.3 } }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-12 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoShuffleOutline /> Calm Cards Shuffle
            </h2>

            {/* Card Container */}
            <motion.div
                key={key} // Triggers AnimatePresence on tap
                onClick={revealCard}
                variants={cardVariants}
                initial="initial"
                animate={isRevealed ? "flip" : "initial"}
                whileTap="tap"
                className={`relative w-72 h-48 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 transform-style-preserve-3d ${cardBackBg}`}
            >
                <AnimatePresence mode="wait">
                    {/* Content on the Card */}
                    <motion.div
                        key={isRevealed}
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        exit="initial"
                        className={`absolute inset-0 rounded-xl p-4 flex items-center justify-center ${cardFrontBg}`}
                    >
                        {isRevealed ? (
                            <p className="text-xl font-bold text-white leading-relaxed">
                                {cardContent}
                            </p>
                        ) : (
                            <p className={`text-lg font-semibold ${highlightColor}`}>
                                {cardContent}
                            </p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <p className="text-sm text-gray-500 mt-6">
                Tap the card to shuffle and receive a grounding message. ↻
            </p>

            <motion.button
                onClick={onComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-20 px-10 py-4 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2 text-lg uppercase tracking-wider`}
            >
                <IoCheckmarkCircleOutline size={22} /> Finished Activity
            </motion.button>
        </div>
    );
}