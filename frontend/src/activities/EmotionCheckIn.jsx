import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircleOutline, IoHappyOutline, IoCaretForwardOutline, IoSyncOutline } from "react-icons/io5";

// Define stages for the activity
const STAGES = {
    SELECT: 'select',
    AFFIRM: 'affirm',
    REAPPRAISE: 'reappraise',
};

const emojis = [
    { emoji: "😊", emotion: "Joyful", text: "You are doing great! Keep that positive energy flowing." },
    { emoji: "😔", emotion: "Sad", text: "It’s okay to feel this way. Allow the feeling to be, knowing it will pass." },
    { emoji: "😡", emotion: "Angry", text: "Acknowledge the heat. Take a deep breath. You're in control." },
    { emoji: "😰", emotion: "Anxious", text: "This feeling is temporary. You are safe. Anchor yourself with a slow breath." },
    { emoji: "😴", emotion: "Tired", text: "Listen to your body. Prioritize rest and be kind to yourself." },
];

export default function EmotionCheckIn({ onComplete }) {
    const [selected, setSelected] = useState(null);
    const [stage, setStage] = useState(STAGES.SELECT);
    const [reappraisalText, setReappraisalText] = useState('');

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const selectedRing = "ring-4 ring-teal-500/80 ring-offset-4 ring-offset-[#152D30]";
    const inputBg = "bg-[#0A1517]";

    // --- Framer Motion Variants ---
    const listContainerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    const emojiItemVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 },
    };

    const cardVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150 } },
        exit: { opacity: 0, scale: 0.9 },
    };
    
    // Handler to move from Affirmation to Reappraisal
    const handleReappraisalStart = () => {
        setStage(STAGES.REAPPRAISE);
    };

    // Handler to move from Reappraisal to Complete
    const handleCompleteSubmission = () => {
        // In a real app, you would log selected.emotion, selected.text, and reappraisalText here.
        if (onComplete) {
            onComplete();
        }
    };


    const renderContent = () => {
        const currentEmoji = emojis[selected];

        if (stage === STAGES.SELECT) {
            return (
                /* --- Step 1: Selection --- */
                <motion.div
                    key="selection"
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex flex-wrap justify-center gap-6 max-w-xl"
                >
                    {emojis.map((e, i) => (
                        <motion.div
                            key={i}
                            variants={emojiItemVariants}
                            onClick={() => {
                                setSelected(i);
                                setStage(STAGES.AFFIRM);
                            }}
                            whileHover={{ scale: 1.15, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-4 rounded-xl ${cardBg} shadow-lg cursor-pointer transition-transform duration-300`}
                            title={e.emotion}
                        >
                            <div className="text-5xl">{e.emoji}</div>
                        </motion.div>
                    ))}
                </motion.div>
            );
        } 
        
        if (stage === STAGES.AFFIRM) {
            return (
                /* --- Step 2: Affirmation --- */
                <motion.div
                    key="affirmation"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`text-center flex flex-col items-center gap-6 ${cardBg} p-8 rounded-2xl border border-[#2A474A] max-w-md shadow-2xl`}
                >
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                        className={`text-7xl p-4 rounded-full ${selectedRing} shadow-inner bg-[#102325]`}
                    >
                        {currentEmoji.emoji}
                    </motion.div>
                    
                    <p className="text-xl font-semibold text-white mt-4">
                        {currentEmoji.text}
                    </p>
                    
                    <motion.button 
                        onClick={handleReappraisalStart} 
                        className={`mt-4 px-8 py-3 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2 text-md uppercase tracking-wider`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <IoCaretForwardOutline size={22} /> Proceed to Reflection
                    </motion.button>

                    <button 
                        onClick={() => setStage(STAGES.SELECT)}
                        className="text-sm text-gray-500 hover:text-teal-400 transition"
                    >
                        &larr; Change Emotion
                    </button>
                </motion.div>
            );
        }

        if (stage === STAGES.REAPPRAISE) {
             return (
                /* --- Step 3: Reappraisal (Action/Reframing) --- */
                <motion.div
                    key="reappraise"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`text-center flex flex-col items-center gap-6 ${cardBg} p-8 rounded-2xl border border-[#2A474A] max-w-md shadow-2xl`}
                >
                    <h3 className="text-xl font-bold text-white mb-2">
                        You chose: {currentEmoji.emotion} {currentEmoji.emoji}
                    </h3>
                    <p className="text-md text-gray-400">
                        How can you **reframe** or **act** on this feeling right now?
                    </p>
                    
                    <textarea
                        className={`w-full h-32 p-4 rounded-xl ${inputBg} border border-teal-700/50 text-gray-200 focus:ring-2 focus:ring-teal-400 outline-none resize-none placeholder-gray-500`}
                        placeholder="Example: 'I will take a 5-minute walk to address my anxiety,' or 'This sadness is a sign I need self-compassion.'"
                        value={reappraisalText}
                        onChange={(e) => setReappraisalText(e.target.value)}
                    />

                    <motion.button 
                        onClick={handleCompleteSubmission} 
                        className={`mt-4 px-10 py-4 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2 text-lg uppercase tracking-wider`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <IoCheckmarkCircleOutline size={22} /> Log & Finish Check-in
                    </motion.button>
                    
                    <button 
                        onClick={() => setStage(STAGES.AFFIRM)}
                        className="text-sm text-gray-500 hover:text-teal-400 transition"
                    >
                        &larr; Back to Affirmation
                    </button>
                </motion.div>
            );
        }
    }


    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-12 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoSyncOutline /> Full Emotional Check-in
            </h2>

            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </div>
    );
}