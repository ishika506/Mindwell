import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import API from "../services/api"; 
import {
  IoMusicalNoteOutline,
  IoPersonOutline,
  IoPlayCircleOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

export default function SongsRecommendations({ horizontal = false }) {
  const [songs, setSongs] = useState([]);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef(null);

  // Mood → Song keyword mapping
  const moodToSongKeyword = {
    sad: "lofi chill",
    neutral: "pop hits",
    happy: "dance upbeat",
    excited: "edm party",
  };

  const fetchTodaysMood = async () => {
    try {
      const res = await API.get("/mood/today");
      const moodValue = res.data?.mood?.mood || "neutral";
      setMood(moodValue);
      return moodValue;
    } catch (err) {
      console.error("Mood fetch error:", err);
      return "neutral";
    }
  };

  const fetchSongs = async (keyword) => {
    try {
      setLoading(true);

      const query = keyword || "relaxing music";

      const res = await fetch(
        `https://itunes.apple.com/search?term=${query}&entity=song&limit=12`
      );
      const data = await res.json();

      setSongs(
        data.results.map((s) => ({
          id: s.trackId,
          artist: s.artistName,
          title: s.trackName,
          preview: s.previewUrl,
          artwork: s.artworkUrl100?.replace("100x100bb", "300x300bb"),
        }))
      );
    } catch (error) {
      console.error("Songs fetch error:", error);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      const userMood = await fetchTodaysMood();
      const keyword = moodToSongKeyword[userMood] || "relaxing music";
      fetchSongs(keyword);
    };

    load();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const SongCard = ({ song }) => (
    <motion.div
      key={song.id}
      whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}
      className="shadow-xl rounded-xl p-3 bg-[#102325] border border-[#2A474A] min-w-[200px] max-w-[200px] flex-shrink-0 transition-all"
    >
      <img
        src={song.artwork}
        alt={song.title}
        className="rounded-lg w-full h-44 object-cover shadow-md"
      />

      <h3 className="text-base font-bold text-gray-100 mt-3 line-clamp-2">
        {song.title}
      </h3>

      <p className="text-xs text-gray-400 mt-1 flex items-center">
        <IoPersonOutline className="mr-1 text-gray-500" />
        {song.artist}
      </p>

      <audio controls className="mt-3 w-full h-8 rounded-full bg-gray-800">
        <source src={song.preview} type="audio/mpeg" />
      </audio>

      <a
        href={song.preview}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded-lg text-xs uppercase font-semibold"
      >
        <IoPlayCircleOutline size={14} className="inline mr-1" /> Preview
      </a>
    </motion.div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center w-full min-h-[250px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        <p className="ml-4 text-lg text-yellow-400">Loading songs...</p>
      </div>
    );

  if (horizontal) {
    return (
      <div className="relative w-full flex flex-col">
        <p className="text-sm text-gray-400 mb-4">
          Mood detected:{" "}
          <strong className="capitalize text-yellow-400">{mood}</strong>
        </p>

        <div className="flex items-center">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 p-2 rounded-full bg-[#152D30] text-yellow-400 border border-[#2A474A]"
          >
            <IoChevronBackOutline size={24} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 py-2 overflow-x-scroll scroll-smooth whitespace-nowrap hide-scrollbar px-4"
          >
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 p-2 rounded-full bg-[#152D30] text-yellow-400 border border-[#2A474A]"
          >
            <IoChevronForwardOutline size={24} />
          </button>
        </div>

        <style jsx="true">{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-5 text-yellow-400 flex items-center">
        <IoMusicalNoteOutline className="mr-3" /> Song Recommendations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}
