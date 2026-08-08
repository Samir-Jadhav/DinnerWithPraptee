const DEVICE_TYPES = new Set(["Mobile", "Tablet", "Desktop"]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { attempt, time, device } = req.body || {};
  const isValidAttempt = Number.isSafeInteger(attempt) && attempt > 0;

  if (!isValidAttempt || !DEVICE_TYPES.has(device) || Number.isNaN(Date.parse(time))) {
    return res.status(400).json({ error: "Invalid attempt notification data" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram environment variables are not configured.");
    return res.status(500).json({ error: "Telegram is not configured" });
  }

  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Kolkata"
  }).format(new Date(time));
  const message = `\u{1F49C} Maybe Not attempt #${attempt}\n\nPraptee tried to click "Maybe not."\n\nTime:\n${formattedTime} IST\n\nDevice:\n${device}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error("Telegram Maybe Not notification failed:", result);
      return res.status(502).json({ success: false });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram Maybe Not notification error:", error);
    return res.status(500).json({ success: false });
  }
}
