const axios = require("axios");

function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.TG_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.TG_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID (or TG_BOT_TOKEN/TG_CHAT_ID)");
  }

  return { botToken, chatId };
}

async function sendToTelegram({ name, message, ip }) {
  const { botToken, chatId } = getTelegramConfig();
  const timeIso = new Date().toISOString();

  const text = [
    "🎁 Новое поздравление!",
    `От: ${name}`,
    `Текст: ${message}`,
    `IP: ${ip}`,
    `Time: ${timeIso}`
  ].join("\n");

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await axios.post(
      url,
      {
        chat_id: chatId,
        text
      },
      {
        timeout: 10000
      }
    );

    if (!response.data || response.data.ok !== true) {
      throw new Error(`Telegram API rejected message: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(`Telegram HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }

    throw new Error(`Telegram network error: ${error.message}`);
  }
}

module.exports = sendToTelegram;
