import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloudOutline, IoCheckmarkCircleOutline, IoSend } from "react-icons/io5";

export default function CloudThoughts({ onComplete }) {
    const [thought, setThought] = useState("");
    const [showCloud, setShowCloud] = useState(false);
    const [isReleased, setIsReleased] = useState(false);

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const inputBg = "bg-[#0A1517]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const buttonDone = "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-700/40";

    const handleRelease = (event, info) => {
        // Only trigger release if the drag movement was significant (e.g., fast enough or far enough)
        // Check if the cloud was dragged outside the original container area limits (optional but makes it feel like release)
        if (info.velocity.y < -50 || info.point.y < 100) { 
            setIsReleased(true);
            // Delay onComplete slightly to let the release animation finish
            setTimeout(onComplete, 1200);
        } else {
            // Snap back if the drag was not decisive
            // Note: Framer Motion handles the snap back automatically based on dragConstraints,
            // but we ensure the released state is not set.
        }
    };

    // Framer Motion Variants for the Cloud
    const cloudVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring' } },
        release: { 
            opacity: 0, 
            y: -800, // Move high up and away
            scale: 0.1,
            transition: { duration: 1, ease: "easeIn" } 
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-2 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoCloudOutline /> Cognitive Defusion: Cloud Thoughts
            </h2>
            <p className="text-lg text-gray-400 mb-12 text-center max-w-sm">
                
                Name your temporary thought, visualize it as a cloud, and release it into the sky.
            </p>

            <div className="w-full max-w-md p-6 rounded-2xl border border-[#2A474A] shadow-inner bg-[#102325] text-center min-h-[300px] relative overflow-hidden">
                
                <AnimatePresence mode="wait">
                    {!showCloud ? (
                        /* --- STEP 1: INPUT --- */
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <textarea
                                className={`w-full h-32 p-4 rounded-xl ${inputBg} border border-teal-700/50 text-gray-200 focus:ring-2 focus:ring-teal-400 outline-none resize-none placeholder-gray-500`}
                                placeholder="What is the specific thought or worry you want to release right now?"
                                onChange={(e) => setThought(e.target.value)}
                                value={thought}
                            />
                            
                            <button
                                onClick={() => thought.trim() && setShowCloud(true)}
                                disabled={!thought.trim()}
                                className={`mt-4 px-6 py-3 rounded-xl font-bold transition ${buttonPrimary} flex items-center justify-center mx-auto text-lg disabled:opacity-50`}
                            >
                                <IoSend className="mr-2" /> Turn into Cloud
                            </button>
                        </motion.div>
                    ) : (
                        /* --- STEP 2: CLOUD (DRAGGABLE) --- */
                        <motion.div
                            key="cloud"
                            variants={cloudVariants}
                            initial="initial"
                            animate={isReleased ? "release" : "animate"}
                            onDragEnd={handleRelease}
                            drag // Enables drag interaction
                            dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }} // Increased drag area
                            dragElastic={0.5} 
                            className={`relative w-48 h-28 mx-auto mt-12 ${highlightColor.replace('text-', 'bg-')} bg-opacity-70 rounded-full flex items-center justify-center cursor-grab shadow-xl border border-teal-300/50 text-black font-semibold p-4 text-center`}
                        >
                            <p className="text-sm line-clamp-3">{thought}</p>
                            
                            {/* Instruction overlay for dragging */}
                            {!isReleased && (
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-black/80 font-bold opacity-70">
                                    DRAG IT UP AND AWAY!
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
            
            {(showCloud || isReleased) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12"
                >
                    <button
                        onClick={onComplete}
                        className={`mt-4 px-10 py-4 font-bold rounded-xl ${buttonDone} transition-all flex items-center gap-2 text-lg uppercase tracking-wider`}
                    >
                        <IoCheckmarkCircleOutline size={22} /> Session Complete
                    </button>
                </motion.div>
            )}

        </div>
    );
}