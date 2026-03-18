import React, { useEffect, useState, useRef } from "react"; // Imported useRef
import axios from "axios";
import { motion } from "framer-motion";
import { 
    IoFilmOutline, 
    IoHappyOutline, 
    IoTimeOutline, 
    IoPlayCircleOutline, 
    IoChevronBackOutline, // Arrow button left
    IoChevronForwardOutline // Arrow button right
} from "react-icons/io5";

export default function MoviesRecommendations({ horizontal = false }) {
    const [movies, setMovies] = useState([]);
    const [mood, setMood] = useState("");
    const [loading, setLoading] = useState(true);
    
    // --- Ref for the scrollable container ---
    const scrollContainerRef = useRef(null); 

    // --- Theme Constants ---
    const cardBg = "bg-[#0A1517]"; 
    const textColor = "text-gray-100";
    const highlightColor = "text-teal-400";
    const actionButton = "bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-700/30";
    const moodColor = "text-yellow-400";
    const arrowButton = "bg-[#152D30] text-teal-400 hover:bg-[#203D41] border border-[#2A474A]";

    const fetchMovies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:8800/api/recommend/movies",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMood(res.data.mood);
            setMovies(res.data.movies);
        } catch (err) {
            console.error("Movie fetch error:", err);
            setMovies([]);
            setMood("N/A");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);
    
    // --- Scroll Functionality ---
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 250; // Scroll by the width of one card plus gap
            const container = scrollContainerRef.current;
            
            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    // --- Movie Card Component ---
    const MovieCard = ({ movie }) => (
        <motion.div
            key={movie.id}
            whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}
            className={`shadow-xl rounded-xl p-3 ${cardBg} border border-[#2A474A] min-w-[200px] max-w-[200px] flex-shrink-0 transition-all duration-300`}
        >
            {/* Image/Poster */}
            <div className="relative mb-3 aspect-w-2 aspect-h-3">
                {movie.poster ? (
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="rounded-lg w-full h-auto object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="bg-gray-700 h-32 flex items-center justify-center rounded-lg text-gray-400">
                        <IoFilmOutline size={30} />
                    </div>
                )}
            </div>

            {/* Content */}
            <h3 className={`text-base font-bold ${textColor} line-clamp-2`}>{movie.title}</h3>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                <p className="flex items-center">
                    <IoTimeOutline className="mr-1" /> {movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}
                </p>
                {movie.rating && (
                    <p className="flex items-center">
                        <IoHappyOutline className="mr-1 text-yellow-500" /> {movie.rating}
                    </p>
                )}
            </div>
            
            <p className="text-xs mt-2 text-gray-400 line-clamp-2 min-h-[2.5em]">{movie.overview || "No summary available."}</p>

            {/* Action Button */}
            <a
                href={movie.watch_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 block text-center ${actionButton} px-3 py-2 rounded-lg font-semibold transition text-xs uppercase`}
            >
                <IoPlayCircleOutline size={14} className="inline mr-1" /> Watch
            </a>
        </motion.div>
    );

    // --- Loading/Error State ---
    if (loading)
        return (
            <div className="flex justify-center items-center w-full min-h-[250px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                <p className={`ml-4 text-lg ${highlightColor}`}>Finding the perfect movie...</p>
            </div>
        );

    if (movies.length === 0 && !loading)
        return (
            <div className="text-center w-full p-10 border border-[#2A474A] rounded-xl bg-[#152D30]">
                <p className="text-xl text-gray-400">
                    No movie recommendations found. Try checking your mood again later.
                </p>
            </div>
        );

    // --- Main Component Return ---
    
    // 1. Horizontal Scroll Layout with Arrows (Used by the parent RecommendationsPage)
    if (horizontal) {
        return (
            <div className="relative w-full flex items-center">
                
                {/* Left Arrow Button */}
                <button
                    onClick={() => scroll('left')}
                    className={`absolute left-0 z-10 p-2 rounded-full shadow-lg transition-all transform -translate-x-1/2 ${arrowButton}`}
                    aria-label="Scroll Left"
                >
                    <IoChevronBackOutline size={24} />
                </button>
                
                {/* Scrollable Content Container (hiding the scrollbar) */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 py-2 overflow-x-scroll scroll-smooth whitespace-nowrap hide-scrollbar px-4"
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
                
                {/* Right Arrow Button */}
                <button
                    onClick={() => scroll('right')}
                    className={`absolute right-0 z-10 p-2 rounded-full shadow-lg transition-all transform translate-x-1/2 ${arrowButton}`}
                    aria-label="Scroll Right"
                >
                    <IoChevronForwardOutline size={24} />
                </button>

                {/* Custom CSS to hide the scrollbar */}
                <style jsx="true">{`
                    .hide-scrollbar {
                        scrollbar-width: none; /* Firefox */
                        -ms-overflow-style: none; /* IE and Edge */
                    }
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none; /* Chrome, Safari, and Opera */
                    }
                `}</style>
            </div>
        );
    }


    // 2. Default/Standalone Vertical Grid Layout (Fallback/Testing)
    return (
        <div className="p-5">
            <h2 className={`text-3xl font-bold mb-5 ${highlightColor} flex items-center`}>
                <IoFilmOutline className="mr-3" /> Mood Based Movie Recommendations
            </h2>

            <p className={`text-lg font-semibold mb-6 ${textColor}`}>
                🤖 Based on your mood: <span className={`capitalize font-extrabold ${moodColor}`}>{mood}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}