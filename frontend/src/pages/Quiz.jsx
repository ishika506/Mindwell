import React, { useState } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoHappyOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

const questions = [
  { question: "How energized are you today?", options: ["💤 Low", "🙂 Neutral", "⚡ Good", "🔥 Amazing"] },
  { question: "How stressed do you feel?", options: ["😫 Very", "😕 Medium", "😌 Low", "😇 Peaceful"] },
  { question: "Did you talk to people today?", options: ["🙅‍♂️ No", "🙂 A little", "👥 Yes", "🎉 A lot"] },
  { question: "How productive was your day?", options: ["📉 Not at all", "📝 A little", "✅ Productive", "🚀 Super"] },
  { question: "Did you care for yourself today?", options: ["❌ No", "🫧 A bit", "🌱 Yes", "✨ Fully"] },
  { question: "How would you rate your emotions?", options: ["😩 Struggled", "😐 Okay", "🙂 Stable", "🥰 Happy"] },
  { question: "Overall mood today?", options: ["🌧️ Low", "⛅ Neutral", "🌤️ Good", "☀️ Amazing"] }
];

// --- Styling Constants ---
const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
const cardBg = "bg-[#152D30]";
const borderColor = "border-[#2A474A]";
const tealPrimary = "text-teal-400";
const buttonNormal = "border-gray-600 text-gray-200 hover:bg-[#203D41] hover:border-teal-500/50";
const buttonGradient = (index) => {
    // Color scale from index 0 (low) to index 3 (high)
    const colors = [
        "bg-red-700/30 border-red-500/50",
        "bg-yellow-700/30 border-yellow-500/50",
        "bg-green-700/30 border-green-500/50",
        "bg-teal-700/30 border-teal-500/50"
    ];
    return colors[index] || "bg-gray-600/30";
};


const MoodQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSelect = async (optIndex) => {
    const updated = [...answers, optIndex];
    setAnswers(updated);

    // Check if this is the last question
    if (current === questions.length - 1) {
      setIsSubmitting(true);
      const score = updated.reduce((a, b) => a + b, 0);

      // Determine mood based on score (0 to 21)
      let quizMood = "";
      // Scoring thresholds (0-5: sad, 6-12: neutral, 13-18: happy, 19-21: excited)
      if (score <= 5) quizMood = "🌧️ Low";
      else if (score <= 12) quizMood = "⛅ Neutral";
      else if (score <= 18) quizMood = "🌤️ Good";
      else quizMood = "☀️ Amazing";

      // Map to backend-friendly mood
      const moodMap = {
        "🌧️ Low": "sad",
        "⛅ Neutral": "neutral",
        "🌤️ Good": "happy",
        "☀️ Amazing": "excited",
      };

      const finalMood = moodMap[quizMood] || "neutral";

      try {
        const res = await API.post("/mood", {
          mood: finalMood, // backend-friendly mood
          score,
          note: "Daily mood quiz",
        });

        console.log("Quiz Submission Successful:", res.data);
        // Display results briefly before navigating
        setTimeout(() => {
             navigate("/dashboard");
        }, 1500);

      } catch (err) {
        console.error("API ERROR:", err.response?.data || err);
        alert("Error submitting quiz. Check console for details.");
        setIsSubmitting(false);
      }
      return;
    }

    // Move to next question after a brief delay for animation visibility
    setTimeout(() => {
        setCurrent(current + 1);
    }, 200);
  };
  
  // Final Result State Component
  const FinalResult = ({ finalScore }) => {
    let message = "Thank you for checking in!";
    let icon = <IoHappyOutline size={50} className="text-teal-400" />;

    if (finalScore <= 5) {
      message = "You're taking the first step. Be kind to yourself today.";
    } else if (finalScore <= 12) {
      message = "Solid check-in. Consistency is key!";
    } else if (finalScore <= 18) {
      message = "Great mood score! Keep the positive momentum.";
    } else {
      message = "Fantastic! You're thriving. Keep nurturing your well-being.";
      icon = <IoCheckmarkCircleOutline size={50} className="text-green-400" />;
    }

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        {icon}
        <h2 className="text-3xl font-bold text-white mt-4">Quiz Complete!</h2>
        <p className="text-xl text-gray-300 mt-2">Score: {finalScore}/21</p>
        <p className="text-gray-400 mt-6 italic">{message}</p>
        <div className="mt-8">
            {isSubmitting ? (
                <div className="flex items-center justify-center text-teal-400">
                    <span className="animate-spin h-6 w-6 border-b-2 border-teal-400 rounded-full mr-3"></span>
                    Analyzing results...
                </div>
            ) : (
                 <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-all"
                >
                    Go to Dashboard
                </button>
            )}
        </div>
      </motion.div>
    );
  };


  const currentQuestion = questions[current];
  const totalScore = answers.reduce((a, b) => a + b, 0);


  return (
    <div className={`h-screen flex justify-center items-center ${primaryBg} p-6`}>
      <motion.div
        className={`${cardBg} p-8 rounded-3xl shadow-2xl w-full max-w-lg border ${borderColor}`}
      >
        {current === questions.length ? (
            <FinalResult finalScore={totalScore} />
        ) : (
            <>
                <h2 className="text-2xl font-bold text-center border-b border-[#2A474A] pb-3 text-teal-300 flex items-center justify-center gap-2">
                    <IoHappyOutline className="text-teal-400"/>
                    Mood Check-In <span className="text-lg font-semibold text-gray-400">({current + 1}/{questions.length})</span>
                </h2>

                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        key={current}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-3xl font-extrabold text-center mt-8 text-white">
                            {currentQuestion.question}
                        </p>

                        <div className="mt-10 space-y-4">
                            {currentQuestion.options.map((opt, index) => (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    key={index}
                                    onClick={() => handleSelect(index)}
                                    className={`w-full py-4 rounded-xl text-lg transition font-medium border-2 
                                                ${buttonNormal} ${buttonGradient(index)}`}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </>
        )}
      </motion.div>
    </div>
  );
};

export default MoodQuiz;