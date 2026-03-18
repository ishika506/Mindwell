import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    IoMusicalNoteOutline, 
    IoPauseOutline, 
    IoPlayOutline, 
    IoCheckmarkCircleOutline 
} from "react-icons/io5";

// -------------------- IMPORT MUSIC FILES --------------------

// HAPPY
import happy1 from "../../public/audio/happy1.mp3";
import happy2 from "../../public/audio/happy2.mp3";
import happy3 from "../../public/audio/happy3.mp3";

// CALM
import calm1 from "../../public/audio/calm1.mp3";
import calm2 from "../../public/audio/calm2.mp3";
import calm3 from "../../public/audio/calm3.mp3";

// FOCUS
import focus1 from "../../public/audio/focus1.mp3";
import focus2 from "../../public/audio/focus2.mp3";
import focus3 from "../../public/audio/focus3.mp3";

// -------------------- MUSIC TRACK CONFIG --------------------

const musicTracks = [
    { 
        mood: "Happy", 
        emoji: "😊", 
        files: [happy1, happy2, happy3],
        color: "bg-yellow-500", 
        highlight: "text-yellow-400" 
    },
    { 
        mood: "Calm", 
        emoji: "😌", 
        files: [calm1, calm2, calm3],
        color: "bg-teal-500", 
        highlight: "text-teal-400" 
    },
    { 
        mood: "Focus", 
        emoji: "🧠", 
        files: [focus1, focus2, focus3],
        color: "bg-indigo-500", 
        highlight: "text-indigo-400" 
    },
];

export default function MusicMoodMatch({ onComplete }) {

    const [currentAudio, setCurrentAudio] = useState(null);
    const [playingMood, setPlayingMood] = useState(null);

    // Theme
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";

    // -------------------- MUSIC TOGGLE LOGIC --------------------

    const toggleMusic = (track) => {
        if (currentAudio && playingMood === track.mood) {
            // If the same mood is playing, pause it.
            currentAudio.pause();
            setPlayingMood(null);
            return;
        }

        if (currentAudio) {
            // Stop any other track that might be playing
            currentAudio.pause();
        }

        // Randomly select a file from the track's list
        const randomIndex = Math.floor(Math.random() * track.files.length);
        const selectedFile = track.files[randomIndex];

        const newAudio = new Audio(selectedFile);

        newAudio.play().catch(err => {
            console.error("Audio Error:", err);
            // Alert user about potential file/autoplay issues
            alert(`Could not play music: ${track.mood}. Check console for file path issues.`);
            setPlayingMood(null);
        });
        
        // Ensure the audio loops for continuous background play
        newAudio.loop = true;

        setCurrentAudio(newAudio);
        setPlayingMood(track.mood);
    };

    // Finish button stops audio and calls onComplete
    const handleComplete = () => {
        if (currentAudio) {
            currentAudio.pause();
        }
        if (onComplete) onComplete();
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (currentAudio) currentAudio.pause();
        };
    }, [currentAudio]);


    // -------------------- UI --------------------
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}
        >

            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-12 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoMusicalNoteOutline /> Music Mood Match
            </h2>

            <p className="text-lg text-gray-400 mb-8 text-center max-w-sm">
                Choose the track that matches the mood you wish to cultivate.
            </p>

            {/* Mood Buttons */}
            <div className="flex flex-wrap justify-center gap-6 p-6 rounded-2xl border border-[#2A474A] shadow-inner bg-[#102325] max-w-xl">
                {musicTracks.map((track) => (
                    <motion.button
                        key={track.mood}
                        onClick={() => toggleMusic(track)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-6 rounded-xl shadow-xl transition-all flex flex-col items-center min-w-[120px] ${cardBg} border-2 ${
                            playingMood === track.mood
                                ? `${track.highlight.replace("text-", "border-")} ring-2 ring-offset-2 ring-offset-[#102325]`
                                : "border-[#2A474A]"
                        }`}
                    >
                        <div className="text-4xl mb-2">{track.emoji}</div>
                        <p className={`text-md font-bold ${track.highlight}`}>{track.mood}</p>
                        <div className="mt-3 text-white">
                            {playingMood === track.mood ? <IoPauseOutline size={20} /> : <IoPlayOutline size={20} />}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Now Playing */}
            <p className="mt-8 text-lg font-semibold text-white min-h-[25px]">
                {playingMood ? (
                    <span className="flex items-center gap-2">
                        <motion.span
                            // Subtle animation to show music is actively playing
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-teal-400"
                        >
                            <IoMusicalNoteOutline size={20} />
                        </motion.span>
                        Now Playing: {playingMood}
                    </span>
                ) : (
                    <span className="text-gray-500">Music is currently paused.</span>
                )}
            </p>

            {/* Done Button */}
            <motion.button
                onClick={handleComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-10 px-10 py-4 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2 text-lg uppercase tracking-wider`}
            >
                <IoCheckmarkCircleOutline size={22} /> Finished Listening
            </motion.button>

        </motion.div>
    );
}