import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoLeafOutline, 
    IoSunnyOutline, 
    IoWaterOutline, 
    IoSparklesOutline, 
    IoCheckmarkCircleOutline,
    IoCompassOutline,
    IoChevronForward
} from "react-icons/io5";

const steps = [
    { 
        id: 0, 
        title: "The Landscape", 
        text: "Close your eyes. Imagine a sanctuary where you feel completely safe. Is it a sun-drenched beach, a quiet forest, or a familiar room?", 
        icon: <IoLeafOutline />, 
        bg: "from-[#0d2a1f] to-[#0a1517]", // Deep forest teal
        accent: "text-emerald-400"
    },
    { 
        id: 1, 
        title: "The Colors", 
        text: "Look around. Notice the colors—the vibrant greens of leaves, the deep blues of water, or the warm, golden glow of sunlight.", 
        icon: <IoSunnyOutline />, 
        bg: "from-[#2a240d] to-[#0a1517]", // Warm amber dark
        accent: "text-yellow-400"
    },
    { 
        id: 2, 
        title: "The Sounds", 
        text: "Listen closely. Hear the gentle rustle of leaves, the rhythmic crash of waves, or perhaps a profound, soothing silence.", 
        icon: <IoWaterOutline />, 
        bg: "from-[#0d1b2a] to-[#0a1517]", // Deep ocean blue
        accent: "text-blue-400"
    },
    { 
        id: 3, 
        title: "The Atmosphere", 
        text: "Notice the air on your skin. Feel the weight lifting from your shoulders as this sanctuary's peace fills your heart.", 
        icon: <IoSparklesOutline />, 
        bg: "from-[#220d2a] to-[#0a1517]", // Soft purple dusk
        accent: "text-purple-400"
    }
];

export default function SafePlaceVisualization({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [placeName, setPlaceName] = useState("");

    const primaryBg = "bg-[#0a1517]";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40";

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        else setIsFinished(true);
    };

    return (
        <div className={`min-h-screen ${primaryBg} text-gray-200 pl-[280px] pr-12 py-12 flex items-center justify-center relative overflow-hidden transition-colors duration-1000`}>
            
            {/* DYNAMIC BACKGROUND LAYER */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].bg} z-0`}
                />
            </AnimatePresence>

            {/* FLOATING PARTICLES */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        animate={{
                            y: [Math.random() * 1000, -100],
                            x: [Math.random() * 1000, Math.random() * 1000],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ duration: Math.random() * 10 + 10, repeat: Infinity }}
                    />
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl w-full z-10 flex flex-col items-center"
            >
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-black tracking-tighter text-white mb-2 uppercase italic">Sanctuary</h1>
                    <div className="flex justify-center gap-3">
                        {steps.map((_, i) => (
                            <motion.div 
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-teal-400 w-10' : 'bg-white/10 w-4'}`}
                            />
                        ))}
                    </div>
                </header>

                <div className="bg-black/40 backdrop-blur-2xl rounded-[50px] p-12 border border-white/10 shadow-2xl relative w-full overflow-hidden">
                    
                    <AnimatePresence mode="wait">
                        {!isFinished ? (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                                className="flex flex-col items-center text-center"
                            >
                                {/* FOCUS PULSE VISUALIZER */}
                                <div className="relative w-48 h-48 mb-10">
                                    <motion.div 
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className={`absolute inset-0 rounded-full border-2 ${steps[currentStep].accent.replace('text', 'border')}`}
                                    />
                                    <div className={`absolute inset-0 flex items-center justify-center text-7xl ${steps[currentStep].accent}`}>
                                        {steps[currentStep].icon}
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-widest">
                                    {steps[currentStep].title}
                                </h2>
                                
                                <p className="text-2xl text-gray-300 leading-relaxed font-light italic mb-12 max-w-xl">
                                    "{steps[currentStep].text}"
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleNext}
                                    className={`px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] flex items-center gap-2 ${buttonPrimary} transition-all`}
                                >
                                    {currentStep === steps.length - 1 ? "Anchor Safe Place" : "Breathe & Continue"} 
                                    <IoChevronForward size={22} />
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center flex flex-col items-center"
                            >
                                <motion.div 
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="text-8xl text-teal-400 mb-8"
                                >
                                    <IoCompassOutline />
                                </motion.div>
                                
                                <h2 className="text-4xl font-black text-white mb-4">Your Mind's Anchor</h2>
                                <p className="text-gray-400 mb-8 text-lg max-w-md italic">
                                    Name this sanctuary so you can return to it instantly whenever you feel overwhelmed.
                                </p>

                                <input 
                                    type="text"
                                    placeholder="e.g. The Midnight Beach"
                                    value={placeName}
                                    onChange={(e) => setPlaceName(e.target.value)}
                                    className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-5 text-xl text-center text-white focus:outline-none focus:border-teal-400 transition-all mb-10 placeholder:text-white/20"
                                />

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onComplete && onComplete(placeName)}
                                    className={`w-full max-w-md py-6 rounded-2xl font-black uppercase tracking-widest ${buttonPrimary} flex items-center justify-center gap-3`}
                                >
                                    <IoCheckmarkCircleOutline size={26} /> Complete Journey
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.p 
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mt-10 text-center text-gray-500 font-bold uppercase tracking-[0.4em] text-xs"
                >
                    Phase {currentStep + 1} • Guided Visualization
                </motion.p>
            </motion.div>
        </div>
    );
}