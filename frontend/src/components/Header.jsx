import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "easeOut", duration: 0.7, ease: [0.17, 0.67, 0.83, 0.67] }, // Added cubic-bezier ease for smoother feel
        },
    };
    
    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]"; // Deep dark gradient
    const highlightColor = "text-teal-300";
    const highlightGlow = "bg-teal-400/15"; // Adjusted glow color

    return (
        // Changed static color to gradient background for more depth
        <header className={`relative overflow-hidden ${primaryBg} pb-40 pt-32`}> 

            {/* Centered Glow Background (Refined size and blur) */}
            <div className="absolute inset-0 flex justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className={`w-[400px] h-[400px] ${highlightGlow} blur-[150px] rounded-full mt-24`} 
                />
            </div>

            <div className="relative max-w-4xl mx-auto px-6 flex flex-col items-center text-center">

                {/* TEXT CONTENT */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center"
                >
                    <motion.p
                        variants={itemVariants}
                        className={`text-base md:text-lg ${highlightColor} uppercase tracking-widest font-semibold mb-4`}
                    >
                        Your Daily Dose of Calm
                    </motion.p>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8"
                    >
                        Nurture Your <span className={highlightColor}>Mind</span>, 
                        <br />
                        Empower Your <span className={highlightColor}>Life</span>.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="max-w-2xl text-gray-400 text-lg md:text-xl leading-relaxed mb-12"
                    >
                        Mindwell offers a secure space to explore your thoughts and feelings.
                        Our **AI companion** provides gentle support and **insightful tools** to
                        guide you toward lasting emotional well-being and growth.
                    </motion.p>

                    {/* CTA BUTTONS (Primary/Secondary Distinction) */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        {/* Primary Button: Stronger, more inviting call to action */}
                        <Link
                            to="/signup"
                            className={`px-10 py-4 rounded-full bg-teal-600 text-white font-bold text-lg shadow-xl shadow-teal-700/40 
                                     hover:bg-teal-500 transition-all transform hover:-translate-y-0.5`}
                        >
                            Begin Your Journey
                        </Link>

                        {/* Secondary Button: Subtler, border-based design */}
                        <Link
                            to="/howitworks"
                            className={`px-10 py-4 rounded-full bg-transparent text-gray-200 font-medium border-2 border-white/20 text-lg 
                                     hover:border-teal-400 hover:text-teal-300 transition-all`}
                        >
                            Learn More About Mindwell
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </header>
    );
};

export default Header;