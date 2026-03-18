import React, { useEffect, useState, useRef } from "react";
import { IoBookOutline, IoChevronBackOutline, IoChevronForwardOutline, IoSyncCircleOutline, IoPersonOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import API from "../services/api"; // your axios instance

// --- Theme Constants (Tailwind equivalents) ---
const THEME = {
    CARD_BG: "bg-[#102325]", 
    BORDER_COLOR: "border-[#2A474A]",
    TEXT_COLOR: "text-gray-100",
    ACCENT_TEAL: "text-teal-400",
    ACCENT_YELLOW: "text-yellow-400",
    BUTTON_BG: "bg-teal-600 hover:bg-teal-500",
    BUTTON_TEXT: "text-white",
    LOADING_COLOR: "border-teal-400",
};

export default function BooksRecommendations({ horizontal = true }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mood, setMood] = useState("");
    const scrollRef = useRef(null);

    // -----------------------------
    // 1️⃣ Fetch Today's Mood
    // -----------------------------
    const fetchMood = async () => {
        try {
            const res = await API.get("/mood/today");
            // Assuming mood is returned as a lowercase string like 'happy', 'sad', 'stressed'
            const currentMood = res.data.mood?.mood || "neutral";
            setMood(currentMood);
            return currentMood;
        } catch (err) {
            console.error("Mood fetch error:", err);
            setMood("neutral");
            return "neutral";
        }
    };

    // -----------------------------
    // 2️⃣ Mood → Keywords for books
    // -----------------------------
    const moodKeywords = {
        happy: "inspirational self-help books",
        sad: "emotional healing and mindfulness",
        angry: "calm mind emotional intelligence",
        stressed: "stress management and self-care",
        neutral: "top self-improvement books",
    };

    // -----------------------------
    // 3️⃣ Fetch Books (Google Books API)
    // -----------------------------
    const fetchBooks = async (keyword = "self improvement") => {
        try {
            setLoading(true);

            // Using fetch instead of axios since the endpoint is external (Google Books)
            const res = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=12`
            );

            const data = await res.json();

            setBooks(
                (data.items || []).map((b) => ({
                    id: b.id,
                    title: b.volumeInfo.title,
                    authors: b.volumeInfo.authors?.join(", ") || "Unknown Author",
                    thumbnail:
                        b.volumeInfo.imageLinks?.thumbnail ||
                        b.volumeInfo.imageLinks?.smallThumbnail ||
                        "",
                    description: b.volumeInfo.description || "No description available.",
                    link: b.volumeInfo.previewLink,
                }))
            );
        } catch (err) {
            console.error("Book fetch error:", err);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // 4️⃣ Load mood → fetch books
    // -----------------------------
    useEffect(() => {
        (async () => {
            const todayMood = await fetchMood();
            const keyword = moodKeywords[todayMood] || "best self improvement";
            fetchBooks(keyword);
        })();
    }, []);

    // -----------------------------
    // Scrolling Controls
    // -----------------------------
    const scroll = (dir) => {
        if (scrollRef.current) {
            const amt = 250; // Scroll amount tailored for the card size
            scrollRef.current.scrollBy({
                left: dir === "left" ? -amt : amt,
                behavior: "smooth",
            });
        }
    };

    // -----------------------------
    // Book Card Component
    // -----------------------------
    const BookCard = ({ book }) => (
        <motion.div
            key={book.id}
            whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}
            className={`${THEME.CARD_BG} ${THEME.BORDER_COLOR} border rounded-xl p-3 shadow-md min-w-[210px] max-w-[210px] transition-all duration-300`}
        >
            <div className="mb-3 aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
                {book.thumbnail ? (
                    <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                        <IoBookOutline size={30} />
                    </div>
                )}
            </div>

            <h3 className={`text-base font-bold ${THEME.TEXT_COLOR} line-clamp-2 min-h-[2.5em]`}>
                {book.title}
            </h3>
            
            <p className="text-xs text-gray-400 mt-1 flex items-center">
                <IoPersonOutline className="mr-1 text-gray-500" size={12} />
                {book.authors}
            </p>

            <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 block text-center ${THEME.BUTTON_BG} ${THEME.BUTTON_TEXT} font-semibold py-2 rounded-lg text-xs uppercase tracking-wider transition-colors`}
            >
                Preview Book
            </a>
        </motion.div>
    );
    
    // -----------------------------
    // UI — Loading State
    // -----------------------------
    if (loading)
        return (
            <div className="flex justify-center items-center w-full min-h-[200px]">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${THEME.LOADING_COLOR}`}></div>
                <p className={`ml-3 ${THEME.ACCENT_TEAL}`}>Fetching personalized reading list...</p>
            </div>
        );

    // -----------------------------
    // UI — No Books State
    // -----------------------------
    if (books.length === 0)
        return (
            <div className={`text-center p-6 ${THEME.CARD_BG} ${THEME.BORDER_COLOR} border rounded-xl text-gray-400 w-full`}>
                <IoBookOutline size={30} className="mx-auto mb-2 text-gray-500" />
                <p>No book recommendations found for your current mood.</p>
                <p className="text-sm mt-1">Try refreshing or checking your network connection.</p>
            </div>
        );

    // -----------------------------
    // Main UI (Horizontal Layout)
    // -----------------------------
    return (
        <div className="relative w-full">
            {/* Mood message */}
            <p className="text-sm text-gray-400 mb-3">
                Books based on your mood:{" "}
                <span className={`capitalize ${THEME.ACCENT_YELLOW} font-semibold`}>{mood}</span>
            </p>

            <div className="flex items-center">
                
                {/* Left Arrow */}
                <button
                    onClick={() => scroll("left")}
                    className={`absolute left-0 z-10 ${THEME.CARD_BG} ${THEME.ACCENT_TEAL} ${THEME.BORDER_COLOR} border p-2 rounded-full -translate-x-1/2 shadow-lg transition-all duration-300`}
                    aria-label="Scroll left"
                >
                    <IoChevronBackOutline size={22} />
                </button>

                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 py-3 overflow-x-scroll hide-scrollbar scroll-smooth px-6"
                >
                    {books.map((b) => (
                        <BookCard book={b} key={b.id} />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll("right")}
                    className={`absolute right-0 z-10 ${THEME.CARD_BG} ${THEME.ACCENT_TEAL} ${THEME.BORDER_COLOR} border p-2 rounded-full translate-x-1/2 shadow-lg transition-all duration-300`}
                    aria-label="Scroll right"
                >
                    <IoChevronForwardOutline size={22} />
                </button>
            </div>

            {/* Hide scrollbar CSS */}
            <style jsx="true">{`
                .hide-scrollbar {
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}