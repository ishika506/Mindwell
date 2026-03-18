import React from "react";
import MoviesRecommendations from "../components/MoviesRecommendations";
import SongsRecommendations from "../components/SongsRecommendations";
import BooksRecommendations from "../components/BooksRecommendations";
import { IoFilmOutline, IoMusicalNoteOutline, IoBookOutline } from "react-icons/io5"; // Import icons for headings

export default function RecommendationsPage() {
    // Consistent Dark Theme Colors
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardTrack = "bg-[#152D30]";
    const scrollThumb = "scrollbar-thumb-teal-600/70";
    const scrollTrack = "scrollbar-track-[#102325]";
    const headingColor = "text-white";

    return (
        <div className={`ml-[240px] flex-1 min-h-screen p-12 ${primaryBg} text-gray-100 flex flex-col items-center`}>
            
            {/* PAGE HEADER */}
            <header className="text-center mb-16 max-w-4xl border-b border-[#2A474A] pb-6">
                <h1 className="text-5xl font-extrabold text-white mb-2">
                    <span className="text-teal-400">Daily</span> Inspirations & Tools
                </h1>
                <p className="text-gray-400 text-xl">
                    Curated content, aligned with your well-being journey, ready to inspire and engage you.
                </p>
            </header>

            {/* --- MOVIES SECTION --- */}
            <section className="w-full max-w-6xl mb-12 p-6 rounded-xl shadow-2xl bg-[#152D30] border border-[#2A474A]">
                <h2 className={`text-3xl font-bold ${headingColor} mb-4 flex items-center`}>
                    <IoFilmOutline className="mr-3 text-teal-400" size={30} /> 
                    Movies & Visual Stories
                </h2>
                <p className="text-gray-400 mb-6">Recommendations for focused reflection or relaxation.</p>
                
                <div className={`flex overflow-x-auto gap-6 py-4 scrollbar-thin ${scrollThumb} ${scrollTrack}`}>
                    <MoviesRecommendations horizontal />
                </div>
            </section>
            
            ---

            {/* --- SONGS SECTION --- */}
            <section className="w-full max-w-6xl mb-12 p-6 rounded-xl shadow-2xl bg-[#152D30] border border-[#2A474A]">
                <h2 className={`text-3xl font-bold ${headingColor} mb-4 flex items-center`}>
                    <IoMusicalNoteOutline className="mr-3 text-yellow-400" size={30} /> 
                    Music & Soundscapes
                </h2>
                <p className="text-gray-400 mb-6">Uplifting tracks and calming soundscapes for meditation or focus.</p>

                <div className={`flex overflow-x-auto gap-6 py-4 scrollbar-thin ${scrollThumb} ${scrollTrack}`}>
                    {/* Note: Updated component names in the actual file if needed, keeping usage simple here */}
                    <SongsRecommendations horizontal /> 
                </div>
            </section>
            
            ---

            {/* --- BOOKS SECTION --- */}
            <section className="w-full max-w-6xl mb-12 p-6 rounded-xl shadow-2xl bg-[#152D30] border border-[#2A474A]">
                <h2 className={`text-3xl font-bold ${headingColor} mb-4 flex items-center`}>
                    <IoBookOutline className="mr-3 text-lime-400" size={30} /> 
                    Books & Reading Material
                </h2>
                <p className="text-gray-400 mb-6">Recommended reading for personal growth, psychology, and mindfulness.</p>

                <div className={`flex overflow-x-auto gap-6 py-4 scrollbar-thin ${scrollThumb} ${scrollTrack}`}>
                    <BooksRecommendations />
                </div>
            </section>
            
        </div>
    );
}