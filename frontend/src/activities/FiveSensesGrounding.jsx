import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoEyeOutline, 
    IoHandRightOutline, 
    IoHeadsetOutline, 
    IoFlowerOutline, 
    IoRestaurantOutline,
    IoCheckmarkCircleOutline,
    IoAlertCircleOutline ,
      IoChevronForwardOutline// Added for empty state warning
} from "react-icons/io5";

// Structure the senses according to the 5-4-3-2-1 rule
const sensesData = [
    { name: "SEE", count: 5, icon: IoEyeOutline, color: "#4FB3BF" },       // Teal
    { name: "TOUCH", count: 4, icon: IoHandRightOutline, color: "#FBC02D" }, // Yellow
    { name: "HEAR", count: 3, icon: IoHeadsetOutline, color: "#B6F2DD" },    // Light Teal
    { name: "SMELL", count: 2, icon: IoFlowerOutline, color: "#EF4444" },   // Red
    { name: "TASTE", count: 1, icon: IoRestaurantOutline, color: "#A855F7" },// Purple
];

export default function FiveSensesGrounding({ onComplete }) {
    const [currentSenseIndex, setCurrentSenseIndex] = useState(0);
    const [currentCount, setCurrentCount] = useState(sensesData[0].count);
    const [input, setInput] = useState("");
    const [responses, setResponses] = useState({}); 
    const [errorShake, setErrorShake] = useState(false);

    const currentSense = sensesData[currentSenseIndex];

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const inputBg = "bg-[#0A1517]";
    const inputBorder = "border-[#2A474A]";
    const focusRing = "focus:ring-teal-400";

    const handleNext = () => {
        if (!input.trim()) {
            // Trigger error shake if input is empty
            setErrorShake(true);
            setTimeout(() => setErrorShake(false), 500);
            return;
        }

        // 1. Record the response
        setResponses(prev => ({
            ...prev,
            [currentSense.name]: [...(prev[currentSense.name] || []), input.trim()]
        }));
        setInput("");

        // 2. Check if we've completed the current sense category
        if (currentCount > 1) {
            // Decrement counter within the current sense category
            setCurrentCount(currentCount - 1);
        } else if (currentSenseIndex < sensesData.length - 1) {
            // Move to the next sense category
            const nextIndex = currentSenseIndex + 1;
            setCurrentSenseIndex(nextIndex);
            setCurrentCount(sensesData[nextIndex].count);
        } else {
            // 3. All steps complete
            onComplete && onComplete();
        }
    };
    
    // --- Framer Motion Variants ---
    const cardVariants = {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 150 } },
        exit: { opacity: 0, scale: 0.9, y: -20 },
        shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } } // Shake animation
    };

    const SenseIcon = currentSense.icon;
    const itemsCompleted = currentSense.count - currentCount + 1; 

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-2 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                5-4-3-2-1 Grounding Technique
            </h2>
            <p className="text-lg text-gray-400 mb-8 text-center max-w-sm">
                Focus on your sensory input to anchor yourself to the present moment. 
            </p>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSense.name}
                    variants={cardVariants}
                    initial="initial"
                    animate={errorShake ? "shake" : "animate"}
                    exit="exit"
                    className={`text-center ${cardBg} p-8 rounded-3xl border border-[#2A474A] max-w-md w-full shadow-2xl`}
                >
                    {/* Step Title & Icon */}
                    <motion.div
                        className="flex flex-col items-center justify-center gap-3 mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <SenseIcon size={48} style={{ color: currentSense.color }} />
                        <h3 className="text-3xl font-extrabold text-white" style={{ color: currentSense.color }}>
                            {currentSense.count} things you {currentSense.name}
                        </h3>
                    </motion.div>
                    
                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {Array.from({ length: currentSense.count }).map((_, i) => (
                            <div 
                                key={i}
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                    i < itemsCompleted 
                                    ? 'bg-teal-400' 
                                    : 'bg-gray-700'
                                }`}
                                title={`Item ${i + 1}`}
                            ></div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Name a specific thing you can ${currentSense.name.toLowerCase()}... (Item ${itemsCompleted})`}
                        className={`w-full h-24 p-4 rounded-xl ${inputBg} ${inputBorder} text-gray-200 focus:ring-2 ${focusRing} outline-none resize-none placeholder-gray-500 mb-6`}
                    />
                    
                    {/* Next Button */}
                    <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-4 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center justify-center gap-2 text-lg uppercase tracking-wider`}
                    >
                        {currentSenseIndex === sensesData.length - 1 && currentCount === 1 ? (
                            <>
                                <IoCheckmarkCircleOutline size={22} /> Finish Grounding
                            </>
                        ) : (
                            <>
                                Next Item <IoChevronForwardOutline size={22} />
                            </>
                        )}
                    </motion.button>
                    
                    {/* Error Message */}
                    {errorShake && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 text-sm text-red-400 flex items-center justify-center"
                        >
                            <IoAlertCircleOutline className="mr-1" /> Please describe something first.
                        </motion.p>
                    )}

                </motion.div>
            </AnimatePresence>
            
        </div>
    );
}