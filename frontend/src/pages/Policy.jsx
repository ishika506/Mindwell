import React from "react";
import { Link } from "react-router-dom";
import { IoShieldCheckmarkOutline, IoDocumentTextOutline, IoLockClosedOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const PolicyPage = () => {
  // --- Theme Constants ---
  const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
  const cardBg = "bg-[#152D30]";
  const highlightColor = "text-teal-400";
  const textColor = "text-gray-400";
  const headingColor = "text-white";

  // Animation variant for sections
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${primaryBg} px-6 md:px-12 py-16 text-gray-200 flex flex-col items-center`}>
        
        {/* Header */}
        <motion.div 
            className="max-w-4xl text-center mb-16 border-b border-[#2A474A] pb-8"
            {...fadeInUp}
        >
          <h1 className={`text-5xl font-extrabold mb-3 ${headingColor} flex items-center justify-center gap-3`}>
            <IoShieldCheckmarkOutline className={highlightColor.replace('text-', 'text-')} size={40} />
            Privacy & Legal Policies
          </h1>
          <p className={`text-xl ${textColor}`}>
            Your trust is our top priority. Learn how we protect your data and govern your use of Mindwell.
          </p>
        </motion.div>

        {/* Policy Sections Grid */}
        <div className="max-w-4xl w-full space-y-12">
          
          {/* 1. Privacy Policy */}
          <motion.section 
            className={`${cardBg} p-8 rounded-2xl shadow-xl border border-[#2A474A]`}
            {...fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <h2 className={`text-3xl font-bold mb-4 ${highlightColor} flex items-center gap-2`}>
              <IoLockClosedOutline /> Privacy Policy Summary
            </h2>
            <p className={`text-sm ${textColor} mb-4`}>
              *Last updated: December 11, 2025*
            </p>

            <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>1. Data We Collect</h3>
            <ul className={`list-disc ml-6 ${textColor} space-y-1 mb-4`}>
              <li>**User Content:** Mood scores, journal entries, and chat transcripts. This data is highly sensitive and is pseudonymized for AI analysis.</li>
              <li>**Usage Data:** Activity logs, feature usage, and device type (non-personal).</li>
              <li>**Authentication Data:** Name, email, and hashed password.</li>
            </ul>

            <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>2. How We Use Data</h3>
            <p className={`mb-4 ${textColor}`}>
              We use your data exclusively to provide and improve the Mindwell service:
              <ul className={`list-disc ml-6 ${textColor} space-y-1 mt-1`}>
                <li>To generate personalized **AI insights** and recommendations.</li>
                <li>To track your **daily goals** and progress.</li>
                <li>**Crucially:** Your journal entries are never shared or sold to third parties. They are analyzed **only by the AI model** for your benefit.</li>
              </ul>
            </p>

            <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>3. Data Security</h3>
            <p className={`${textColor}`}>
              All user content is stored encrypted at rest (AES-256). Communication between your device and our servers is secured via SSL/TLS. We implement strict access controls to protect your personal reflections.
            </p>
          </motion.section>

          
          {/* 2. Terms of Use */}
          <motion.section 
            className={`${cardBg} p-8 rounded-2xl shadow-xl border border-[#2A474A]`}
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h2 className={`text-3xl font-bold mb-4 ${highlightColor} flex items-center gap-2`}>
              <IoDocumentTextOutline /> Terms of Use
            </h2>

            <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>1. Nature of Service</h3>
            <p className={`mb-4 ${textColor}`}>
              Mindwell is an **emotional wellness companion** and **does not provide medical advice, diagnosis, or treatment**. It is not a substitute for professional mental health care. Always seek the advice of a qualified healthcare provider for any questions regarding a medical condition.
            </p>

            <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>2. User Responsibilities</h3>
            <p className={`mb-4 ${textColor}`}>
              You agree to use Mindwell only for personal, non-commercial purposes. You must be over 13 years old (or the minimum age required in your jurisdiction) to use this service.
            </p>

            <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>3. Termination</h3>
            <p className={`${textColor}`}>
              We reserve the right to suspend or terminate your account if you breach these Terms. You may terminate your account and request data deletion at any time via your account settings.
            </p>
          </motion.section>
        </div>
        
        {/* Contact/Full Document Link */}
        <motion.div 
            className="mt-16 text-center"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
        >
            <p className={`text-lg ${textColor}`}>
                For full details, please contact us at: <a href="mailto:support@mindwell.app" className={`${highlightColor.replace('text-', 'text-')} hover:underline`}>support@mindwell.app</a>
            </p>
            <Link to="/contact" className={`mt-4 block text-lg font-semibold ${highlightColor} hover:text-teal-300 transition`}>
                &larr; Back to Home
            </Link>
        </motion.div>

      </div>
      <Footer />
    </>
  );
};

export default PolicyPage;