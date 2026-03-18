import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function ActivityModal({ activityComponent: ActivityComponent, onClose }) {
    // --- Theme Constants ---
    const overlayBg = "bg-black/80"; // Darker, more immersive overlay
    const modalBg = "bg-[#152D30]"; // Modal card background
    const borderColor = "border-teal-600/50";
    const closeColor = "text-gray-400 hover:text-teal-400";

    // --- Modal Variants (Slightly refined spring for a premium feel) ---
    const modalCardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 180, damping: 15 } // Adjusted damping slightly
        },
        exit: {
            opacity: 0,
            scale: 0.85,
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {ActivityComponent && (
                <motion.div
                    className={`fixed inset-0 ${overlayBg} z-[1000] flex justify-center items-center p-4`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Modal Card */}
                    <motion.div
                        variants={modalCardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        // The max-width is set here, but the inner activity content controls its final size
                        className={`${modalBg} rounded-3xl shadow-2xl w-[95%] max-w-4xl max-h-[95vh] relative`}
                    >
                        {/* Close Button - Placed directly on the modal card */}
                        <button
                            onClick={onClose}
                            className={`absolute top-4 right-4 text-3xl z-10 p-1 rounded-full transition-colors ${closeColor} hover:bg-[#203D41]`}
                            aria-label="Close activity"
                        >
                            <IoCloseCircleOutline size={30} />
                        </button>
                        
                        {/* Render actual activity */}
                        {/* Since many activities take min-h-screen, we'll let them define their full layout */}
                        <div className="rounded-3xl overflow-hidden">
                            <ActivityComponent onComplete={onClose} />
                            {/* We pass onClose as onComplete so the activity itself can trigger modal dismissal */}
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}