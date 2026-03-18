import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    IoPlayCircleOutline, 
    IoBookOutline, 
    IoCheckmarkCircleOutline, 
    IoPauseOutline,
    IoShuffleOutline 
} from "react-icons/io5";

// Assuming these paths are correct relative to the component location
import story1 from "../../public/audio/calmstory1.mp3";
import story2 from "../../public/audio/calmstory2.mp3";
import story3 from "../../public/audio/calmstory3.mp3";
import story4 from "../../public/audio/calmstory4.mp3";

const audioFiles = [
    { title: "The Floating Lantern", file: story1 }, // Updated file source for clarity
    { title: "The Ocean of Quiet", file: story2 },
    { title: "The Mountain of Strength", file: story3 },
    { title: "The Garden Of Peace", file: story4 },
];

export default function CalmStory({ onComplete }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioInstance, setAudioInstance] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(audioFiles[0]); // Default track will be overwritten by shuffle in useEffect
    const [isShuffling, setIsShuffling] = useState(false); // To prevent multiple quick shuffles

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const buttonDone = "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-700/40";

    // --- Audio Logic ---
    const handleStop = () => {
        if (audioInstance) {
            audioInstance.pause();
            setAudioInstance(null);
        }
        setIsPlaying(false);
    }
    
    const shuffleTrack = () => {
        if (isPlaying) {
            handleStop();
        }
        const random = Math.floor(Math.random() * audioFiles.length);
        setCurrentTrack(audioFiles[random]);
        setIsShuffling(false);
    };

    // --- Initial Load & Cleanup ---
    useEffect(() => {
        shuffleTrack();
        
        return () => {
            if (audioInstance) {
                audioInstance.pause();
            }
        };
    }, []); 

    const toggleAudio = () => {
        if (isPlaying) {
            handleStop();
            return;
        }

        // Stop any previous instance if state lagged
        if (audioInstance) {
            handleStop();
        }

        const audio = new Audio(currentTrack.file);
        
        audio.play().catch(err => {
            console.error("Error playing audio:", err);
            alert("Unable to play audio. Check console for details.");
            setIsPlaying(false);
            setAudioInstance(null);
        });

        audio.onended = () => setIsPlaying(false);
        setAudioInstance(audio);
        setIsPlaying(true);
    };

    const handleComplete = () => {
        handleStop(); // Ensure audio stops
        onComplete?.();
    };
    
    const handleShuffleClick = () => {
        setIsShuffling(true);
        shuffleTrack();
        // Allow time for the shuffle animation
        setTimeout(() => setIsShuffling(false), 500);
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}
        >
            
            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-12 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoBookOutline /> Guided Calm Story
            </h2>
            
            {/* Instruction Card */}
            <div className={`relative w-full max-w-sm p-8 rounded-3xl ${cardBg} shadow-2xl border border-[#2A474A] text-center`}>
                <p className="text-lg text-gray-300 mb-6">
                    Close your eyes. Find a comfortable position. Allow your mind to drift gently with the narrative.
                </p>
                <div className="text-sm text-gray-400 italic">
                    Now Playing: <span className="text-white font-semibold">{currentTrack.title}</span>
                </div>
            </div>
            
            {/* Controls Row */}
            <div className="mt-10 flex gap-4">

                {/* Shuffle Button */}
                <motion.button
                    onClick={handleShuffleClick}
                    disabled={isPlaying}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-3 font-bold rounded-xl bg-gray-600 hover:bg-gray-500 text-white transition-all flex items-center gap-2 ${
                        isPlaying || isShuffling ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Shuffle to a different story"
                >
                    <IoShuffleOutline size={22} className={isShuffling ? "animate-spin" : ""} />
                </motion.button>

                {/* Play/Pause Button */}
                <motion.button
                    onClick={toggleAudio}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-10 py-4 font-bold rounded-xl transition-all flex items-center gap-3 text-xl ${buttonPrimary}`}
                >
                    {isPlaying ? (
                        <>
                            <IoPauseOutline size={24} /> Pause
                        </>
                    ) : (
                        <>
                            <IoPlayCircleOutline size={24} /> Play Story
                        </>
                    )}
                </motion.button>
            </div>

            {/* Done Button */}
            <motion.button
                onClick={handleComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-6 px-10 py-3 font-bold rounded-xl ${buttonDone} transition-all flex items-center gap-2 text-md uppercase tracking-wider`}
            >
                <IoCheckmarkCircleOutline size={22} /> Finished Activity
            </motion.button>

        </motion.div>
    );
}