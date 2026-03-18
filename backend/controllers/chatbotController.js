// controllers/chatbotController.js
import moment from "moment";
import Mood from "../models/Mood.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) return res.status(400).json({ error: "Message required" });

    // -----------------------------
    // Fetch latest mood for context
    // -----------------------------
    const latestMood = await Mood.findOne({ userId })
      .sort({ createdAt: -1 })
      .select("mood score note createdAt");

    const moodText = latestMood
      ? `Mood: ${latestMood.mood}, Score: ${latestMood.score}, Note: "${latestMood.note}", Date: ${moment(
          latestMood.createdAt
        ).format("MMMM DD, YYYY")}`
      : "Mood not available.";

    // -----------------------------
    // MOCK RESPONSES
    // -----------------------------
    const mockReplies = [
      `Hey there! I see your mood is: ${moodText}. You said: "${message}". Let's explore this together.`,
      `Thanks for sharing! Based on your mood: ${moodText}, here's what I feel: "${message}" is important. Tell me more.`,
      `I hear you. Mood update: ${moodText}. Your message: "${message}". How does that make you feel?`,
      `You're doing great sharing your thoughts. Mood context: ${moodText}. Message: "${message}". Keep going!`,
      `Interesting! Mood snapshot: ${moodText}. You mentioned: "${message}". Let's dive deeper.`
    ];

    // Pick a random reply
    const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];

    // -----------------------------
    // Return the mock reply
    // -----------------------------
    res.json({ reply });
  } catch (error) {
    console.error("🔥 Chatbot Error:", error);
    res.status(500).json({ error: "Chatbot failed" });
  }
};
