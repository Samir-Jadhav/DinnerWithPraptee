export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        const body = req.body || {};

        let message =
`❤️ DINNER INVITATION ACCEPTED ❤️

Praptee clicked YES! 😊

━━━━━━━━━━━━━━━━━━━━

📅 Dinner Date
15 August 2026

🕖 Pickup Time
7:00 PM IST

⏰ Response Time
${body.time}

━━━━━━━━━━━━━━━━━━━━

❤️ She accepted your invitation.

Time to get ready.`;

        if (body.notificationType === "maybe-not") {
            const allowedDevices = new Set(["Mobile", "Tablet", "Desktop"]);
            const isValidAttempt = Number.isSafeInteger(body.attempt) && body.attempt > 0;

            if (!isValidAttempt || !allowedDevices.has(body.device) || Number.isNaN(Date.parse(body.time))) {
                return res.status(400).json({ error: "Invalid Maybe Not notification data" });
            }

            const formattedTime = new Intl.DateTimeFormat("en-IN", {
                dateStyle: "full",
                timeStyle: "medium",
                timeZone: "Asia/Kolkata"
            }).format(new Date(body.time));

            message = `\u{1F49C} Maybe Not attempt #${body.attempt}\n\nPraptee tried to click "Maybe not."\n\nTime:\n${formattedTime} IST\n\nDevice:\n${body.device}`;
        }

        const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const response = await fetch(telegramURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        const result = await response.json();

        if (body.notificationType === "maybe-not" && (!response.ok || !result.ok)) {
            console.error("Telegram Maybe Not notification failed:", result);
            return res.status(502).json({ success: false });
        }

        return res.status(200).json(result);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
