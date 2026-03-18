import axios from "axios";
import https from "https";
import Mood from "../models/Mood.js";

const TMDB_KEY = process.env.TMDB_KEY || "1444b36d7c3d9ee89b31cb7ea3a994ef";

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
});

// Mood → TMDB genre IDs
const moodGenres = {
  happy: [35, 12],         // Comedy, Adventure
  sad: [18],               // Drama
  neutral: [28, 12, 35],   // Action, Adventure, Comedy
  excited: [28, 53, 12],   // Action, Thriller, Adventure
};

// Random page helper
function randomPage(max = 50) {
  return Math.floor(Math.random() * max) + 1;
}

export const recommendMovies = async (req, res) => {
  try {
    const userId = req.user.id;

    const latestMood = await Mood.findOne({ userId }).sort({ createdAt: -1 });
    const mood = latestMood?.mood || "neutral";

    const genres = moodGenres[mood] || [35]; // fallback comedy
    const page = randomPage(); // DIFFERENT EVERY TIME

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genres.join(
      ","
    )}&sort_by=popularity.desc&page=${page}`;

    const tmdbRes = await axios.get(url, {
      httpsAgent: agent,
      timeout: 15000,
    });

    const movies = tmdbRes.data.results.slice(0, 10).map((m) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      overview: m.overview,
      release_date: m.release_date,
      watch_link: `https://www.google.com/search?q=watch+${m.title}+online`,
    }));

    return res.json({ mood, movies, page }); // page for debugging
  } catch (err) {
    console.log("MOVIE ERROR:", err.message);
    return res.status(500).json({ error: "Movie fetching failed" });
  }
};
