const axios = require('axios');

async function sendToTelegram(name, message) {
  const text = `🎉 Новое поздравление!\n\nИмя: ${name}\nСообщение: С днём рождения! ${message}`;
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: process.env.TG_CHAT_ID,
    text
  });
}

module.exports = sendToTelegram;
