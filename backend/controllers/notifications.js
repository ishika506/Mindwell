import { generateNotification } from "../services/notificationService.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await generateNotification(userId);

    return res.json({ success: true, notifications });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
