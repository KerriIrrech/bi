const express = require("express");
const db = require("../db");
const sendToTelegram = require("../telegram");
const validateInput = require("../validation");
const getClientIp = require("../middleware/getClientIp");

const router = express.Router();

router.post("/", async (req, res) => {
  const validated = validateInput(req.body?.name, req.body?.message);

  if (!validated.ok) {
    return res.status(400).json({ ok: false, error: "validation", reason: validated.error });
  }

  const ip = getClientIp(req);

  db.run(
    `INSERT INTO messages (name, message, ip) VALUES (?, ?, ?)`,
    [validated.name, validated.message, ip],
    async function onInsert(err) {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          console.warn(`[congrats] duplicate ip blocked: ${ip}`);
          return res.status(409).json({ ok: false, error: "ip_used" });
        }

        console.error("[congrats] db error:", err.message);
        return res.status(500).json({ ok: false, error: "server_error" });
      }

      try {
        await sendToTelegram(validated.name, validated.message);
        console.info(`[congrats] telegram sent from ip: ${ip}`);
        return res.status(200).json({ ok: true });
      } catch (tgErr) {
        // Важно: IP уже зафиксирован в БД, повторная отправка не допускается.
        console.error(`[congrats] telegram failed, ip locked: ${ip}`, tgErr.message);
        return res.status(500).json({ ok: false, error: "telegram_failed" });
      }
    }
  );
});

module.exports = router;
