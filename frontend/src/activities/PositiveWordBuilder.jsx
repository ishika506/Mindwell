import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoBuildOutline, IoCheckmarkCircleOutline, IoTrashOutline, IoRefreshCircleOutline } from "react-icons/io5";

const availableLetters = ["C", "A", "L", "M", "B", "R", "A", "V", "E", "O", "Y", "N", "D", "F", "S"];
const positiveWords = ["CALM", "BRAVE", "KIND", "SAFE", "ABLE", "GOOD", "JOY", "PEACE", "GIVE"];

export default function PositiveWordBuilder({ onComplete }) {
    const [word, setWord] = useState("");
    const [message, setMessage] = useState("");
    const [isWordValid, setIsWordValid] = useState(false);
    const [usedLetterIndices, setUsedLetterIndices] = useState([]); // Tracks indices of used buttons
    const [showSuccess, setShowSuccess] = useState(false);

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const letterButtonBg = "bg-teal-700 hover:bg-teal-600 text-white";
    const clearButtonBg = "bg-gray-600 hover:bg-gray-500 text-white";
    const successColor = "text-green-400";

    // --- Letter Management ---
    const addLetter = (l, index) => {
        if (usedLetterIndices.includes(index) || showSuccess) return;

        const newWord = word + l;
        setWord(newWord);
        setUsedLetterIndices([...usedLetterIndices, index]);
        setMessage("");
        
        const isValid = positiveWords.includes(newWord);
        setIsWordValid(isValid);
        if (isValid) {
            setShowSuccess(true);
            setMessage(`YES! ${newWord} is a wonderful word.`);
        }
    };

    const clearWord = () => {
        setWord("");
        setMessage("");
        setIsWordValid(false);
        setUsedLetterIndices([]);
        setShowSuccess(false);
    };

    const checkWord = () => {
        if (!word) return;
        
        const isValid = positiveWords.includes(word);
        setIsWordValid(isValid);
        
        if (isValid) {
            setShowSuccess(true);
            setMessage(`YES! ${word} is a powerful word.`);
        } else {
            setMessage(`Try again. Does "${word}" match a positive word?`);
        }
    };
    
    // --- Framer Motion Variants ---
    const letterVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
    };
    
    const wordDisplayVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-2 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoBuildOutline /> Positive Word Builder
            </h2>
            <p className="text-lg text-gray-400 mb-8 italic max-w-sm text-center">
                Use the letters to construct a positive word (e.g., CALM, BRAVE, JOY).
            </p>

            {/* Current Word Display */}
            <motion.div
                key={word}
                variants={wordDisplayVariants}
                initial="initial"
                animate="animate"
                className={`min-h-[60px] max-w-full px-6 py-3 rounded-xl ${cardBg} border border-[#2A474A] shadow-xl text-center flex items-center justify-center mb-6`}
            >
                <span className={`text-4xl font-extrabold ${showSuccess ? successColor : 'text-white'}`}>
                    {word || "____"}
                </span>
            </motion.div>
            
            {/* Status Message */}
            <AnimatePresence>
                {message && (
                    <motion.p
                        key="message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`text-md font-semibold ${showSuccess ? successColor : 'text-yellow-400'} mb-4`}
                    >
                        {message}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Letter Buttons */}
            <div className={`flex gap-3 flex-wrap justify-center p-4 rounded-xl ${cardBg} border border-[#2A474A] shadow-inner max-w-lg`}>
                {availableLetters.map((l, idx) => {
                    const isUsed = usedLetterIndices.includes(idx);
                    return (
                        <motion.button
                            key={idx}
                            onClick={() => addLetter(l, idx)}
                            variants={letterVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: isUsed ? 1 : 1.1, rotate: isUsed ? 0 : 2 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            disabled={isUsed || showSuccess}
                            className={`px-4 py-3 rounded-lg shadow-md text-xl font-bold transition ${
                                isUsed ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : letterButtonBg
                            }`}
                        >
                            {l}
                        </motion.button>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="mt-8 flex gap-4">
                
                {showSuccess ? (
                    <motion.button
                        onClick={clearWord}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 font-bold rounded-xl ${buttonPrimary} transition flex items-center gap-2`}
                    >
                        <IoRefreshCircleOutline size={22} /> New Word
                    </motion.button>
                ) : (
                    <>
                        <motion.button
                            onClick={clearWord}
                            disabled={!word}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-3 font-bold rounded-xl transition ${clearButtonBg} flex items-center gap-2 disabled:opacity-50`}
                        >
                            <IoTrashOutline size={20} /> Clear
                        </motion.button>
                        
                        <motion.button
                            onClick={checkWord}
                            disabled={!word}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-3 font-bold rounded-xl ${buttonPrimary} transition flex items-center gap-2 disabled:opacity-50`}
                        >
                            Check Word
                        </motion.button>
                    </>
                )}


                <motion.button
                    onClick={onComplete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 font-bold rounded-xl ${buttonPrimary} transition flex items-center gap-2`}
                >
                    <IoCheckmarkCircleOutline size={22} /> Done
                </motion.button>
            </div>
        </div>
    );
}