function sanitize(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return sanitize(value)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[!.,:;'"`~\-–—(){}\[\]\s]+/g, "");
}

function validateInput(rawName, rawMessage) {
  const name = sanitize(rawName);
  const message = sanitize(rawMessage);

  if (name.length < 2 || name.length > 40) {
    return { ok: false, error: "validation_name_length" };
  }

  if (message.length < 5 || message.length > 500) {
    return { ok: false, error: "validation_message_length" };
  }

  if (normalize(message) === "сднемрождения") {
    return { ok: false, error: "validation_message_forbidden" };
  }

  return { ok: true, name, message };
}

module.exports = validateInput;
