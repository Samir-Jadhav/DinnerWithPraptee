export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        const body = req.body || {};

        const message =
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

        return res.status(200).json(result);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}