import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoHeartCircleOutline, IoCheckmarkCircleOutline, IoPencilOutline } from "react-icons/io5";

// Define colors and their corresponding therapeutic concepts (or just visual tags)
const colorData = [
    { name: "Red", hex: "#EF4444", concept: "Energy/Passion", focus: ["Someone who inspires me", "A recent personal victory"], count: 2 },
    { name: "Orange", hex: "#F97316", concept: "Creativity/Joy", focus: ["A small moment of happiness today", "A song that made me smile"], count: 2 },
    { name: "Yellow", hex: "#FBC02D", concept: "Clarity/Hope", focus: ["A recent insight or lesson", "Something I am looking forward to"], count: 2 },
    { name: "Green", hex: "#10B981", concept: "Growth/Calm", focus: ["Something about nature or health", "A quality I appreciate in myself"], count: 2 },
    { name: "Blue", hex: "#3B82F6", concept: "Peace/Trust", focus: ["A simple kindness I received", "A secure place or memory"], count: 2 },
    { name: "Violet", hex: "#8B5CF6", concept: "Wisdom/Spirit", focus: ["A challenge I overcame", "A piece of good advice I was given"], count: 2 },
];

export default function RainbowGratitude({ onComplete }) {
    const [selected, setSelected] = useState(null);
    const [entries, setEntries] = useState([]); // Stores current session entries for the selected color
    const [input, setInput] = useState("");

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const inputBg = "bg-[#0A1517]";

    // --- Dynamic Handlers ---
    
    const selectedCard = selected !== null ? colorData[selected] : null;
    const itemsCompleted = entries.length;
    const totalItems = selectedCard ? selectedCard.count : 0;
    
    const handleEntry = () => {
        if (!input.trim()) return;

        // Record the response and clear input
        setEntries([...entries, input.trim()]);
        setInput("");

        // Check if all items for this color are complete
        if (entries.length + 1 >= totalItems) {
            // Optional: You could navigate to the next color here, but for simplicity, we allow the user to click done.
        }
    };
    
    const handleSelectColor = (index) => {
        setSelected(index);
        setEntries([]);
        setInput("");
    };

    // --- Framer Motion Variants ---
    const cardVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: i * 0.1, type: "spring", stiffness: 100 }
        }),
    };
    
    const entryVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-2 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoHeartCircleOutline /> Rainbow Gratitude Journal
            </h2>
            <p className="text-lg text-gray-400 mb-8 italic max-w-sm text-center">
                Focus on a color and log specific gratitudes to shift your focus to the positive.
            </p>

            {/* --- 1. Color Selection Grid --- */}
            <motion.div 
                className="flex flex-wrap justify-center gap-4 p-4 rounded-xl shadow-inner bg-[#102325]"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="visible"
            >
                {colorData.map((c, i) => (
                    <motion.div
                        key={i}
                        variants={cardVariants}
                        custom={i}
                        className={`h-24 w-16 rounded-xl cursor-pointer transition transform hover:scale-110 border-4 ${c.hex} ${
                            selected === i ? "ring-4 ring-offset-2 ring-teal-400/50 ring-offset-[#102325]" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => handleSelectColor(i)}
                    >
                        {selected === i && (
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs font-extrabold text-white bg-black/30 w-full text-center block pt-1"
                            >
                                Selected
                            </motion.span>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* --- 2. Input and Prompt Area --- */}
            <AnimatePresence mode="wait">
                {selectedCard && (
                    <motion.div 
                        key="input-area"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`mt-8 p-6 rounded-xl ${cardBg} border border-teal-700/50 max-w-md w-full shadow-lg`}
                    >
                        {/* Status/Prompt Header */}
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold" style={{ color: selectedCard.hex }}>
                                {selectedCard.concept} ({itemsCompleted}/{totalItems})
                            </h3>
                            <p className="text-sm text-gray-400 mt-1 italic">
                                Prompt #{itemsCompleted + 1}: {selectedCard.focus[itemsCompleted] || "Focus on the positive."}
                            </p>
                            <div className="mt-2 flex gap-1 justify-center">
                                {Array.from({ length: totalItems }).map((_, i) => (
                                    <div 
                                        key={i}
                                        className={`w-3 h-3 rounded-full ${i < itemsCompleted ? 'bg-green-400' : 'bg-gray-700'}`}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Current Input */}
                        {itemsCompleted < totalItems ? (
                            <>
                                <textarea
                                    className={`p-3 border rounded-xl w-full h-16 ${inputBg} border-[#2A474A] text-gray-200 focus:ring-2 focus:ring-teal-400 outline-none resize-none placeholder-gray-500`}
                                    placeholder={`Write your gratitude for prompt #${itemsCompleted + 1}...`}
                                    onChange={(e) => setInput(e.target.value)}
                                    value={input}
                                />

                                <motion.button
                                    onClick={handleEntry}
                                    disabled={!input.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`block w-full mt-4 px-6 py-3 font-bold rounded-xl ${buttonPrimary} transition disabled:opacity-50 flex items-center justify-center gap-2`}
                                >
                                    <IoPencilOutline size={22} /> Add Entry
                                </motion.button>
                            </>
                        ) : (
                            // Final Completion State for this color
                            <div className="text-center p-4">
                                <IoCheckmarkCircleOutline size={40} className="text-green-400 mx-auto mb-2" />
                                <p className="text-xl font-bold text-white">All entries complete for {selectedCard.name}!</p>
                            </div>
                        )}
                        
                        {/* Display List of Completed Entries */}
                        {itemsCompleted > 0 && (
                            <div className="mt-4 pt-4 border-t border-[#2A474A]">
                                <h4 className="text-sm text-gray-500 mb-2">Logged:</h4>
                                <ul className="space-y-1">
                                    <AnimatePresence>
                                        {entries.map((entry, index) => (
                                            <motion.li 
                                                key={index} 
                                                variants={entryVariants}
                                                initial="initial"
                                                animate="animate"
                                                className="text-xs text-gray-300 bg-[#102325] p-2 rounded-lg break-words"
                                            >
                                                {index + 1}. {entry}
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            </div>
                        )}
                        
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* --- 3. Global Done Button --- */}
            <motion.button
                onClick={onComplete}
                disabled={itemsCompleted === 0} // Only allow completion if at least one entry was made
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-6 px-10 py-4 font-bold rounded-xl ${buttonPrimary} transition disabled:bg-gray-700 disabled:text-gray-400 disabled:shadow-none flex items-center gap-2 uppercase tracking-wider`}
            >
                <IoCheckmarkCircleOutline size={22} /> Finish Session
            </motion.button>
            
        </div>
    );
}