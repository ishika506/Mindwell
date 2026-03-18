import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IoBookOutline, IoChatbubbleEllipsesOutline, IoLeafOutline } from "react-icons/io5"; // Importing icons for features

const About = () => {
  // --- Theme Constants ---
  const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]"; // Deep dark gradient
  const cardBg = "bg-[#152D30]"; // Card background
  const cardHoverBg = "hover:bg-[#1a3336]"; // Subtle hover effect
  const highlightColor = "text-teal-400";
  const buttonPrimary = "bg-teal-500 text-[#0a1517] font-bold shadow-teal-700/50";

  // --- Animation Variants ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // --- Feature Data ---
  const features = [
    {
      title: "Daily Journaling 📝",
      description: "Log your thoughts and feelings every day to gain insight into your emotions and behavioral patterns.",
      icon: <IoBookOutline size={30} className="text-yellow-400" />,
    },
    {
      title: "AI Insights & Coaching 🤖",
      description: "Receive personalized analysis and guidance to understand your emotional trends and identify triggers.",
      icon: <IoChatbubbleEllipsesOutline size={30} className="text-teal-400" />,
    },
    {
      title: "Growth & Support 🌱",
      description: "Access personalized wellness exercises and practices designed to help you grow emotionally and mentally.",
      icon: <IoLeafOutline size={30} className="text-lime-400" />,
    },
  ];

  return (
    <>
      <Navbar />

      {/* Main Content Area */}
      <div className={`min-h-screen ${primaryBg} text-gray-200 px-6 md:px-12 py-16 flex flex-col items-center`}>
        
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl text-center mb-16 border-b border-[#2A474A] pb-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white">
            <span className={highlightColor}>Empowering</span> Your Mental Wellness
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Mindwell is your **AI-powered companion** for emotional wellness. Our mission is to empower you to cultivate positive habits, reflect on your thoughts, and take control of your mental health with compassion and technology.
          </p>
        </motion.div>

        {/* Features / How it Helps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeInUp}
              transition={{ delay: index * 0.15 }}
              className={`p-8 rounded-2xl shadow-xl text-left ${cardBg} border border-[#2A474A] ${cardHoverBg} transition-all`}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-20 text-center bg-[#102325] p-10 rounded-2xl shadow-2xl border border-teal-500/50 max-w-xl w-full"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands finding clarity and calm with personalized AI support.
          </p>
          <a
            href="/signup"
            className={`px-10 py-4 rounded-full ${buttonPrimary} transition-transform transform hover:scale-[1.03] text-lg uppercase tracking-wider`}
          >
            Get Started Now
          </a>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default About;