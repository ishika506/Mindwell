import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoEyeOutline, 
    IoEarOutline, 
    IoHandLeftOutline,
    IoCheckmarkCircleOutline, 
    IoArrowForwardOutline,
    IoSparklesOutline,
    IoArrowBackOutline
} from "react-icons/io5";


const prompts = [
    { id: 0, label: "Sight", text: "Look around. What is one thing you see?", icon: <IoEyeOutline />, color: "text-cyan-400", glow: "shadow-cyan-500/20" },
    { id: 1, label: "Sound", text: "Listen closely. What is one thing you hear?", icon: <IoEarOutline />, color: "text-indigo-400", glow: "shadow-indigo-500/20" },
    { id: 2, label: "Touch", text: "Reach out. What is one thing you can feel?", icon: <IoHandLeftOutline />, color: "text-rose-400", glow: "shadow-rose-500/20" }
];


export default function Name3Things({ onComplete }) {
    const [step, setStep] = useState(0);
    const [inputs, setInputs] = useState(["", "", ""]);
    const [isFinished, setIsFinished] = useState(false);

    const primaryBg = "bg-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40";

    const handleNext = () => {
        if (inputs[step].trim() === "") return;
        if (step < 2) setStep(step + 1);
        else setIsFinished(true);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div className={`min-h-screen ${primaryBg} text-gray-200 pl-[280px] pr-12 py-12 flex items-center justify-center overflow-hidden`}>
            
            {/* Animated Ambient Glow */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1] 
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] ${isFinished ? 'bg-green-500' : 'bg-teal-500'}`}
            />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="inline-block p-3 rounded-2xl bg-teal-500/10 mb-4"
                    >
                        <IoSparklesOutline className="text-teal-400 text-3xl" />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tighter text-white">PRESENT MOMENT</h1>
                    <p className="text-gray-500 text-sm font-bold tracking-[0.3em] mt-1">SENSORY GROUNDING</p>
                </div>

                <div className={`${cardBg} rounded-[40px] p-10 border border-white/10 shadow-2xl backdrop-blur-md relative`}>
                    
                    {/* Step Indicators */}
                    <div className="flex justify-center gap-3 mb-12">
                        {prompts.map((p, idx) => (
                            <div 
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    idx <= step ? 'w-12 bg-teal-500' : 'w-4 bg-gray-800'
                                }`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {!isFinished ? (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center"
                            >
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className={`text-7xl mb-8 ${prompts[step].color} drop-shadow-2xl`}
                                >
                                    {prompts[step].icon}
                                </motion.div>
                                
                                <h2 className="text-2xl font-bold text-white mb-2 text-center">
                                    {prompts[step].label}
                                </h2>
                                <p className="text-gray-400 mb-8 text-center">{prompts[step].text}</p>

                                <div className="w-full relative">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Type softly..."
                                        value={inputs[step]}
                                        onChange={(e) => {
                                            const newIn = [...inputs];
                                            newIn[step] = e.target.value;
                                            setInputs(newIn);
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-xl text-center focus:outline-none focus:border-teal-500 transition-all placeholder:text-gray-700 font-medium"
                                    />
                                </div>

                                <div className="flex gap-4 mt-10 w-full">
                                    {step > 0 && (
                                        <button 
                                            onClick={handleBack}
                                            className="p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors text-gray-500"
                                        >
                                            <IoArrowBackOutline size={24} />
                                        </button>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNext}
                                        className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                                            inputs[step].length > 1 ? buttonPrimary : "bg-gray-800 text-gray-600 opacity-50 cursor-not-allowed"
                                        }`}
                                    >
                                        {step === 2 ? "Finalize" : "Next"} <IoArrowForwardOutline size={20} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                    <IoCheckmarkCircleOutline />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">Anchored</h2>
                                <p className="text-gray-500 mb-8">You have successfully centered your awareness.</p>
                                
                                <div className="space-y-4 mb-10 text-left bg-black/20 p-8 rounded-[30px] border border-white/5 shadow-inner">
                                    {inputs.map((item, idx) => (
                                        <div key={idx} className="flex flex-col border-b border-white/5 pb-3 last:border-0">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${prompts[idx].color}`}>
                                                {prompts[idx].label}
                                            </span>
                                            <span className="text-lg text-gray-200 font-medium italic">"{item}"</span>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onComplete && onComplete(inputs)}
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest ${buttonPrimary}`}
                                >
                                    Log Reflection
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${step === i ? 'bg-teal-500' : 'bg-gray-800'}`} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}