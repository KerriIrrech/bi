const axios = require("axios");

function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.TG_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.TG_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID (or TG_BOT_TOKEN/TG_CHAT_ID)");
  }

  return { botToken, chatId };
}

function normalizePayload(payloadOrName, maybeMessage, maybeIp) {
  if (payloadOrName && typeof payloadOrName === "object" && !Array.isArray(payloadOrName)) {
    return {
      name: payloadOrName.name,
      message: payloadOrName.message,
      ip: payloadOrName.ip
    };
  }

  // Backward compatibility: sendToTelegram(name, message, ip)
  return {
    name: payloadOrName,
    message: maybeMessage,
    ip: maybeIp
  };
}

async function sendToTelegram(payloadOrName, maybeMessage, maybeIp) {
  const { name, message, ip } = normalizePayload(payloadOrName, maybeMessage, maybeIp);
  const { botToken, chatId } = getTelegramConfig();
  const timeIso = new Date().toISOString();

  if (!name || !message) {
    throw new Error("Telegram payload is invalid: name/message is missing");
  }

  const text = [
    "🎁 Новое поздравление!",
    `От: ${name}`,
    `Текст: ${message}`,
    `IP: ${ip || "unknown"}`,
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
