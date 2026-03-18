import { useEffect, useState, useRef } from "react";
import API from "../services/api";

export default function FloatingReminders() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  const isShowing = useRef(false);
  const shownMessages = useRef(new Set());
  const lastActivity = useRef(Date.now()); // 🟢 track user activity
  const lastWeekly = useRef(null);

  // 🕒 Track user activity to trigger sleep reminders
  useEffect(() => {
    const resetActivity = () => (lastActivity.current = Date.now());

    window.addEventListener("click", resetActivity);
    window.addEventListener("keypress", resetActivity);

    return () => {
      window.removeEventListener("click", resetActivity);
      window.removeEventListener("keypress", resetActivity);
    };
  }, []);

  // ⏳ Random interval (10–30 sec)
  const randomDelay = () => Math.floor(Math.random() * 20000) + 10000;

  // 🔮 Motivational quotes
  const quotes = [
    "Start fresh. Every day is a new chance 🌅",
    "Small steps make big changes 💫",
    "You're stronger than you think ✨",
    "Focus on progress, not perfection 🌱",
  ];

  // 🧠 Time-based priority
  const getTimeBasedPriority = () => {
    const hour = new Date().getHours();

    if (hour < 12) return ["mood_support", "boost", "quote", "quiz", "goals"];
    if (hour < 18) return ["goals", "boost", "mood_support", "quiz", "quote"];
    return ["quiz", "goals", "daily_checkin", "mood_support", "boost"];
  };

  // 🟣 Weekly progress reminder (Monday 9 AM)
  const checkWeeklyReminder = () => {
    const now = new Date();
    const isMonday = now.getDay() === 1;
    const hour = now.getHours();

    if (isMonday && hour === 9) {
      const today = now.toDateString();

      if (lastWeekly.current !== today) {
        lastWeekly.current = today;

        processIncoming([
          {
            type: "weekly",
            message: "📊 Weekly check-in: Review your mood & goals progress!",
          },
        ]);
      }
    }
  };

  // 🌙 Sleep reminder (inactive for 45 minutes after 10PM)
  const checkSleepReminder = () => {
    const hour = new Date().getHours();
    const inactiveMin = (Date.now() - lastActivity.current) / 60000;

    if (hour >= 22 && inactiveMin > 45) {
      processIncoming([
        {
          type: "sleep",
          message: "😴 You've been inactive. Maybe it's time to rest?",
        },
      ]);
      lastActivity.current = Date.now(); // prevent spam
    }
  };

  // 🔁 Fetch backend notifications every 20 sec
  useEffect(() => {
    async function loadData() {
      try {
        const res = await API.get("/notifications");
        const notifs = res.data.notifications || [];

        if (notifs.length) processIncoming(notifs);

        checkWeeklyReminder();
        checkSleepReminder();
      } catch (err) {
        console.error("Notification Error:", err);
      }
    }

    loadData();
    const timer = setInterval(loadData, 20000);
    return () => clearInterval(timer);
  }, []);

  // ⚙ Combine backend reminders with custom reminders
  const processIncoming = (notifs) => {
    const priorities = getTimeBasedPriority();

    // Add morning quote at 6–10 AM
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10 && Math.random() < 0.4) {
      notifs.push({
        type: "quote",
        message: quotes[Math.floor(Math.random() * quotes.length)],
      });
    }

    // Remove duplicates
    const filtered = notifs.filter(
      (n) => !shownMessages.current.has(n.message)
    );

    if (filtered.length === 0) return;

    // Apply priority ordering
    filtered.sort(
      (a, b) => priorities.indexOf(a.type) - priorities.indexOf(b.type)
    );

    // Add to queue with smart delay
    filtered.forEach((notif, index) => {
      const delay = index === 0 ? 0 : randomDelay();

      setTimeout(() => {
        shownMessages.current.add(notif.message);

        setQueue((prev) => [...prev, notif]);

        if (!isShowing.current) showNext();
      }, delay);
    });
  };

  // Show notifications sequentially
  const showNext = () => {
    isShowing.current = true;

    setQueue((prev) => {
      if (prev.length === 0) {
        isShowing.current = false;
        return prev;
      }

      const next = prev[0];
      setCurrent(next);

      // Toast visible for 5 sec
      setTimeout(() => {
        setCurrent(null);
        setQueue((p) => p.slice(1));
        setTimeout(showNext, 500);
      }, 5000);

      return prev;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {current && (
        <div className="bg-white border shadow-lg rounded-xl p-4 w-80 animate-slide-up">
          <p className="text-gray-700 text-sm font-medium">
            {current.message}
          </p>
        </div>
      )}
    </div>
  );
}
