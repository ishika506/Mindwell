import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoBookOutline, 
    IoAnalyticsOutline, 
    IoLockClosedOutline, 
    IoFlagOutline, // CORRECTED: Using IoFlagOutline for 'Set Goals'
    IoRocketOutline 
} from "react-icons/io5";

// --- Theme Constants (Tailwind equivalents) ---
const THEME = {
    MAIN_BG: "bg-gradient-to-b from-[#0e2124] to-[#0a1517]",
    CARD_BG: "bg-[#152D30] border border-[#2A474A]",
    ACCENT_LIGHT: "#B6F2DD", // Lighter Teal
    ACCENT_DARK: "#4FB3BF",  // Primary Teal
    HEADING_TEXT: "text-white",
    BODY_TEXT: "text-gray-400",
    BUTTON_TEXT_COLOR: "text-[#0a1517]",
    PROGRESS_BG: "bg-[#2A474A]",
};

const stepsData = [
    {
        icon: IoBookOutline,
        heading: "Reflect & Record",
        text: [
            "Keep a private daily journal to capture your thoughts, emotions, and insights.",
            "Track your mental and emotional patterns effortlessly.",
            "Even 5 minutes of reflection each day strengthens self-awareness."
        ],
        color: THEME.ACCENT_DARK,
        colorClass: "text-teal-400",
    },
    {
        icon: IoAnalyticsOutline,
        heading: "Gain Insight",
        text: [
            "AI-powered analysis detects recurring patterns and emotional triggers.",
            "Receive actionable insights for smarter decisions and growth.",
            "Understand yourself better with each entry."
        ],
        color: THEME.ACCENT_LIGHT,
        colorClass: "text-teal-200",
    },
    {
        icon: IoLockClosedOutline,
        heading: "Privacy & Security",
        text: [
            "Your data stays private and encrypted.",
            "This is a judgment-free, safe space for honest self-expression.",
            "Feel confident to explore your thoughts securely."
        ],
        color: THEME.ACCENT_DARK,
        colorClass: "text-teal-400",
    },
    {
        // CORRECTED: Using IoFlagOutline
        icon: IoFlagOutline, 
        heading: "Set Goals & Track Progress",
        text: [
            "Define personal goals and celebrate small wins every day.",
            "Track achievements to build motivation and confidence.",
            "Consistency turns habits into long-term growth."
        ],
        color: THEME.ACCENT_LIGHT,
        colorClass: "text-teal-200",
    },
    {
        icon: IoRocketOutline,
        heading: "Begin Your Journey",
        text: [
            "Take the first step toward emotional clarity and growth.",
            "Sign up to start your Mindwell journey and unlock your potential.",
            "Our AI companion is here to guide you every step of the way."
        ],
        color: THEME.ACCENT_DARK,
        colorClass: "text-teal-400",
    },
];

const TypewriterText = ({ lines }) => {
    const [currentLine, setCurrentLine] = useState(0);
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        if (currentLine >= lines.length) return;
        let index = 0;
        const interval = setInterval(() => {
            setDisplayText((prev) => prev + lines[currentLine][index]);
            index++;
            if (index === lines[currentLine].length) {
                clearInterval(interval);
                setTimeout(() => {
                    setDisplayText((prev) => prev + "\n");
                    setCurrentLine((prev) => prev + 1);
                }, 400);
            }
        }, 30); // Typing speed
        return () => clearInterval(interval);
    }, [currentLine, lines]);

    return (
        <pre className={`text-base md:text-lg mb-8 whitespace-pre-wrap text-center leading-relaxed ${THEME.BODY_TEXT}`}>
            {displayText}
        </pre>
    );
};

const Welcome = () => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const currentStep = stepsData[step];
    const progress = ((step + 1) / stepsData.length) * 100;

    const handleNext = () => {
        if (step < stepsData.length - 1) setStep(step + 1);
        else navigate("/dashboard"); 
    };
    
    // Dynamically select the icon component
    const IconComponent = currentStep.icon;

    return (
        <div className={`flex items-center justify-center min-h-screen p-4 ${THEME.MAIN_BG}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className={`relative max-w-3xl w-full p-10 md:p-16 rounded-3xl shadow-2xl text-center overflow-hidden ${THEME.CARD_BG}`}
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={`text-8xl mb-6 flex justify-center ${currentStep.colorClass}`}
                        style={{ color: currentStep.color }}
                    >
                        <IconComponent size={60} />
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`text-4xl md:text-5xl font-extrabold mb-6 tracking-tight ${THEME.HEADING_TEXT}`}
                    >
                        {currentStep.heading}
                    </motion.h1>

                    {/* Typewriter Text */}
                    <TypewriterText lines={currentStep.text} />

                    {/* Progress Bar */}
                    <div className={`w-full h-3 rounded-full ${THEME.PROGRESS_BG} mb-8`}>
                        <motion.div
                            className="h-3 rounded-full shadow-lg"
                            style={{ width: `${progress}%`, backgroundColor: currentStep.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Button */}
                    <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                        whileTap={{ scale: 0.97 }}
                        className={`px-12 py-5 font-bold rounded-full text-lg md:text-xl transition-all duration-300 shadow-xl ${THEME.BUTTON_TEXT_COLOR}`}
                        style={{
                            background: `linear-gradient(90deg, ${THEME.ACCENT_DARK}, ${THEME.ACCENT_LIGHT})`,
                        }}
                    >
                        {step === stepsData.length - 1 ? "Go to Dashboard" : "Next Step"}
                    </motion.button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Welcome;