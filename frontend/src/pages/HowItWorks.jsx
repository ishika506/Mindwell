import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IoDocumentTextOutline, IoAnalyticsOutline, IoLeafOutline } from "react-icons/io5"; // Icons for steps

// --- Theme & Layout Constants ---
const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
const cardBg = "bg-[#152D30]";
const highlightColor = "text-teal-400";
const secondaryColor = "text-teal-200";
const ctaButtonBg = "bg-teal-400 text-[#0a1517]";

// --- Animation Variants ---
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, type: "spring", stiffness: 60, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Steps Data (Simplified colors for Tailwind use)
const steps = [
  {
    title: "Step 1: Reflect & Record",
    heading: "Daily Journaling & Mood Tracking",
    description:
      "Log your mood, record feelings, and free-write in your private journal. Reflection becomes an effortless daily habit while you own your emotional data.",
    accentClass: "text-yellow-400", // Yellow for reflection/journaling
    icon: IoDocumentTextOutline,
  },
  {
    title: "Step 2: Gain Insight",
    heading: "Personalized AI Analysis",
    description:
      "Our ethical AI companion uncovers emotional triggers, recurring themes, and patterns. Get clear, actionable insights that help you grow.",
    accentClass: "text-teal-400", // Teal for analytics/AI
    icon: IoAnalyticsOutline,
  },
  {
    title: "Step 3: Grow & Practice",
    heading: "Guided Wellness Exercises",
    description:
      "Based on your insights, Mindwell recommends personalized CBT techniques, coping strategies, and meditations to support long-term well-being.",
    accentClass: "text-purple-400", // Purple for growth/practice
    icon: IoLeafOutline,
  },
];

// Step Card Component (Refactored to use Tailwind)
const StepCard = ({ title, heading, description, accentClass, icon: Icon }) => (
  <motion.div
    className={`${cardBg} relative p-8 md:p-10 rounded-3xl cursor-pointer shadow-xl border border-[#2A474A] transition-shadow duration-300`}
    variants={itemVariants}
    whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)" }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
  >
    <div className="mb-4">
        <Icon size={40} className={accentClass} />
    </div>
    <h3 className={`text-sm md:text-base font-extrabold uppercase tracking-widest mb-2 opacity-80 ${accentClass}`}>
      {title}
    </h3>
    <h2 className={`text-2xl md:text-3xl font-black mb-4 leading-snug ${secondaryColor}`}>
      {heading}
    </h2>
    <p className="text-base md:text-lg leading-relaxed text-gray-400">
      {description}
    </p>
  </motion.div>
);

const HowItWorks = () => {
  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen pt-16 font-sans relative ${primaryBg}`}
      >
        {/* Background Glow Effect (Adjusted for theme) */}
        <div className="absolute inset-0 opacity-50">
            <div className="absolute w-[400px] h-[400px] bg-teal-400/10 blur-[150px] top-10 left-1/4 rounded-full"/>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 py-12 md:py-20">
          {/* Hero */}
          <motion.div
            className="text-center mb-20 md:mb-28 max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <motion.p
              variants={itemVariants}
              className={`text-base md:text-lg font-extrabold uppercase tracking-widest mb-4 ${secondaryColor}`}
            >
              A Clear Journey to Well-being
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold leading-tight text-white"
            >
              Unlock the Power of <span className={highlightColor}>Mindful Reflection</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base md:text-xl leading-relaxed max-w-3xl mx-auto text-gray-400"
            >
              Mindwell provides a structured, compassionate path where your daily thoughts transform into meaningful, positive change.
            </motion.p>
          </motion.div>

          ---

          {/* Steps Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            {steps.map((step, i) => (
              <StepCard key={i} {...step} />
            ))}
          </motion.div>

          ---

          {/* Call to Action */}
          <motion.div
            className="mt-28 p-10 md:p-16 rounded-[40px] text-center shadow-2xl border-2 border-teal-500/50"
            style={{ background: "#102325" }} // Slightly lighter dark background for CTA card
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              The Change Starts Now.
            </h2>
            <p className="text-base md:text-lg mb-8 text-gray-400">
              Sign up in seconds and begin your journey toward emotional clarity.
            </p>
            <Link
              to="/signin"
              aria-label="Sign in to Mindwell"
              className={`inline-block ${ctaButtonBg} font-semibold text-lg md:text-xl px-10 md:px-14 py-4 md:py-5 rounded-full shadow-lg shadow-teal-700/30
                         hover:bg-teal-500 transform hover:scale-105 transition-all duration-300`}
            >
              Sign In to Begin
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HowItWorks;