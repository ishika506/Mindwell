// JournalPage.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoBookOutline, 
    IoPencilOutline, 
    IoTimeOutline, 
    IoSaveOutline,
    IoCloseCircleOutline,
    IoSparklesOutline, // For Mindfulness
    IoLeafOutline, // For Self-growth
    IoEyeOutline, // For Reflection
} from "react-icons/io5";

// Helper function to format the date string (Assuming j.date is an ISO string or similar)
const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        return dateString; // Fallback if parsing fails
    }
};

export default function JournalPage() {
    const { user } = useContext(AuthContext);
    const [content, setContent] = useState("");
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Consistent Deep Dark Theme Colors
    const primaryBg = "bg-gradient-to-b from-[#0e2124] via-[#102325] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const borderColor = "border-teal-600/50";
    const highlightColor = "#4FB3BF";
    const secondaryHighlight = "#B6F2DD";

    useEffect(() => {
        const fetchJournals = async () => {
            if (!user?._id) {
                setLoading(false);
                return;
            }
            try {
                // Assuming the API returns a structured object where journals are in res.data.journals or similar
                const res = await API.get(`/journal/all/${user._id}`);
                // Sort by date descending (latest first)
                const sortedJournals = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setJournals(sortedJournals);
            } catch (err) {
                console.error("Error fetching journals", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJournals();
    }, [user]);

    const handleAddJournal = async () => {
        if (!content.trim()) return;
        setIsSaving(true);
        try {
            const res = await API.post("/journal/add", {
                userId: user._id,
                content,
            });
            // Assuming API response contains the new journal object
            setJournals((prev) => [res.data, ...prev]);
            setContent("");
        } catch (err) {
            console.error("Error saving journal:", err);
            alert(err.response?.data?.message || "Error saving journal");
        } finally {
            setIsSaving(false);
        }
    };

    // Card data using the refined icons
    const benefitCards = [
        {
            title: "Mindfulness",
            desc: "Clarify your thoughts and improve focus.",
            color: highlightColor,
            icon: <IoSparklesOutline size={24} className="text-pink-400"/>,
        },
        {
            title: "Self-growth",
            desc: "Track progress, habits, and daily wins.",
            color: secondaryHighlight,
            icon: <IoLeafOutline size={24} className="text-lime-400"/>,
        },
        {
            title: "Reflection",
            desc: "Understand feelings and emotions better.",
            color: "#FBC02D",
            icon: <IoEyeOutline size={24} className="text-yellow-400"/>,
        },
    ];

    // Journal Detail Modal Component
    const JournalDetailModal = ({ journal, onClose }) => (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className={`${cardBg} w-full max-w-3xl rounded-3xl p-8 shadow-2xl border-l-8 border-teal-500 text-gray-100`}
            >
                <div className="flex justify-between items-start mb-4 border-b border-[#2A474A] pb-3">
                    <div>
                        <h2 className="text-3xl font-bold text-teal-300">Journal Entry</h2>
                        <p className="text-sm text-gray-400 mt-1 flex items-center">
                            <IoTimeOutline className="mr-1"/> 
                            <span className="font-semibold">{formatDate(journal.createdAt || journal.date)}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition">
                        <IoCloseCircleOutline size={30} />
                    </button>
                </div>
                
                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{journal.content}</p>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <div className={`flex-1 ml-[240px] min-h-screen ${primaryBg} py-12 px-6 flex justify-center text-gray-100`}>
            <div className="w-full max-w-5xl flex flex-col items-center relative">

                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-6xl font-extrabold text-white mb-3 flex items-center justify-center gap-3">
                        <IoBookOutline className="text-teal-400" size={50}/>
                        <span className="text-teal-400">Mind</span> Journal
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Your secure space for **daily reflection** and tracking your emotional landscape.
                    </p>
                </header>
                
                {/* Motivational / Benefits Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
                    {benefitCards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }}
                            className={`${cardBg} p-6 rounded-2xl shadow-xl border-l-4 cursor-default flex flex-col items-center border-teal-500`}
                            // Removed inline style for border color to use consistent teal
                        >
                            <div className="text-4xl mb-3">{card.icon}</div>
                            <h3 className="text-xl font-bold text-teal-300 mb-1">{card.title}</h3>
                            <p className="text-gray-400 text-center text-sm">{card.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Add Journal Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`w-full ${cardBg} rounded-3xl p-8 shadow-2xl border-l-8 ${borderColor} mb-12`}
                >
                    <h2 className="text-3xl font-bold text-teal-300 mb-4 flex items-center">
                        <IoPencilOutline className="mr-2"/> Write Today's Entry
                    </h2>
                    <textarea
                        className="w-full h-48 p-5 rounded-xl bg-[#0d0d0d]/70 border border-[#2A474A] text-gray-200 focus:ring-2 focus:ring-teal-400 outline-none text-lg transition-all resize-none"
                        placeholder="What thoughts are occupying your mind right now? Describe your day and any notable emotions."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSaving}
                    />
                    <button
                        onClick={handleAddJournal}
                        disabled={isSaving || !content.trim()}
                        className={`w-full mt-5 py-4 rounded-2xl font-bold text-[#0d0d0d] transition-all shadow-lg 
                                    ${isSaving || !content.trim() 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-teal-400 to-teal-200 hover:scale-[1.01] hover:shadow-teal-700/50'}`}
                    >
                        {isSaving ? (
                            <div className="flex items-center justify-center">
                                <span className="animate-spin h-5 w-5 border-b-2 border-black rounded-full mr-3"></span>
                                Saving...
                            </div>
                        ) : (
                            <>
                                <IoSaveOutline className="inline mr-2" size={20} />
                                Save Entry
                            </>
                        )}
                    </button>
                </motion.section>

                {/* Past Journals Section */}
                <section className="w-full mb-6">
                    <h2 className="text-3xl font-bold text-teal-300 mb-6 border-b border-[#2A474A] pb-2">Entry History</h2>
                    {loading ? (
                        <p className="text-gray-400 text-center p-8">Fetching your history...</p>
                    ) : journals.length === 0 ? (
                        <p className="text-gray-500 text-center p-8 italic">Start writing your first entry above to see your history!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journals.map((j) => (
                                <motion.div
                                    key={j._id}
                                    whileHover={{ y: -3, boxShadow: "0 8px 15px rgba(0,0,0,0.3)" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className={`${cardBg} p-5 rounded-xl shadow-md border-l-4 border-teal-500 cursor-pointer transition-all`}
                                    onClick={() => setSelectedJournal(j)}
                                >
                                    <p className="text-teal-300 font-bold flex items-center text-sm">
                                        <IoTimeOutline className="mr-1"/> {formatDate(j.createdAt || j.date)}
                                    </p>
                                    <p className="text-gray-300 mt-2 line-clamp-2">{j.content}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Journal Detail Modal (Animated) */}
                <AnimatePresence>
                    {selectedJournal && (
                        <JournalDetailModal 
                            journal={selectedJournal} 
                            onClose={() => setSelectedJournal(null)} 
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}