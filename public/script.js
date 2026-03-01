const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const chipText = document.getElementById("chipText");
const titleText = document.getElementById("titleText");
const leadText = document.getElementById("leadText");
const nameLabel = document.getElementById("nameLabel");
const messageLabel = document.getElementById("messageLabel");
const a11yToggle = document.getElementById("a11yToggle");

const birthdayName = "Стас";
const a11yStorageKey = "birthday_congrats_a11y_mode";

const i18n = {
  ru: {
    htmlLang: "ru",
    chip: "RETRO NEON MODE",
    title: `С днём рождения, ${birthdayName}!`,
    lead: "Оставь своё поздравление. С одного IP можно отправить только один раз.",
    nameLabel: "Ваше имя",
    namePlaceholder: "Например, Алекс",
    messageLabel: "Поздравление",
    messagePlaceholder: "Напиши тёплое поздравление (5-500 символов)",
    submit: "Отправить",
    a11yOn: "Режим для слабовидящих: вкл",
    a11yOff: "Режим для слабовидящих: выкл",
    a11yAriaOn: "Выключить режим для слабовидящих",
    a11yAriaOff: "Включить режим для слабовидящих",
    sending: "Отправляем...",
    sent: "Спасибо! Поздравление отправлено 🎉",
    ipUsed: "С этого IP поздравление уже отправлено",
    rateLimited: "Слишком много попыток. Попробуйте чуть позже.",
    telegramFailed: "Telegram временно недоступен. Попытка уже зафиксирована.",
    unknownError: "Не удалось отправить. Попробуйте позже.",
    networkError: "Ошибка сети. Попробуйте позже.",
    validationFallback: "Проверьте поля формы.",
    validationNameLength: "Имя должно быть длиной от 2 до 40 символов.",
    validationMessageLength: "Текст поздравления должен быть длиной от 5 до 500 символов.",
    validationMessageForbidden: "Текст не должен состоять только из фразы «С днём рождения»"
  },
  en: {
    htmlLang: "en",
    chip: "RETRO NEON MODE",
    title: `Happy Birthday, ${birthdayName}!`,
    lead: "Leave your message. Only one message can be sent from one IP address.",
    nameLabel: "Your name",
    namePlaceholder: "For example, Alex",
    messageLabel: "Message",
    messagePlaceholder: "Write a warm birthday message (5-500 characters)",
    submit: "Send",
    a11yOn: "Accessibility mode: on",
    a11yOff: "Accessibility mode: off",
    a11yAriaOn: "Disable accessibility mode",
    a11yAriaOff: "Enable accessibility mode",
    sending: "Sending...",
    sent: "Thanks! Your message has been sent 🎉",
    ipUsed: "A message from this IP has already been sent",
    rateLimited: "Too many attempts. Please try again later.",
    telegramFailed: "Telegram is temporarily unavailable. This attempt has already been recorded.",
    unknownError: "Failed to send. Please try again later.",
    networkError: "Network error. Please try again later.",
    validationFallback: "Please check the form fields.",
    validationNameLength: "Name must be between 2 and 40 characters.",
    validationMessageLength: "Message must be between 5 and 500 characters.",
    validationMessageForbidden: "The text must not be only the phrase 'Happy Birthday'"
  },
  uk: {
    htmlLang: "uk",
    chip: "RETRO NEON MODE",
    title: `З днем народження, ${birthdayName}!`,
    lead: "Залиш своє привітання. З однієї IP-адреси можна надіслати лише один раз.",
    nameLabel: "Ваше ім'я",
    namePlaceholder: "Наприклад, Олексій",
    messageLabel: "Привітання",
    messagePlaceholder: "Напишіть тепле привітання (5-500 символів)",
    submit: "Надіслати",
    a11yOn: "Режим для слабозорих: увімкнено",
    a11yOff: "Режим для слабозорих: вимкнено",
    a11yAriaOn: "Вимкнути режим для слабозорих",
    a11yAriaOff: "Увімкнути режим для слабозорих",
    sending: "Надсилаємо...",
    sent: "Дякую! Привітання надіслано 🎉",
    ipUsed: "З цієї IP-адреси привітання вже надіслано",
    rateLimited: "Занадто багато спроб. Спробуйте трохи пізніше.",
    telegramFailed: "Telegram тимчасово недоступний. Спробу вже зафіксовано.",
    unknownError: "Не вдалося надіслати. Спробуйте пізніше.",
    networkError: "Помилка мережі. Спробуйте пізніше.",
    validationFallback: "Перевірте поля форми.",
    validationNameLength: "Ім'я має бути від 2 до 40 символів.",
    validationMessageLength: "Текст привітання має бути від 5 до 500 символів.",
    validationMessageForbidden: "Текст не повинен складатися лише з фрази 'З днем народження'"
  }
};

function detectLanguage() {
  const langs = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || "en"];

  for (const lang of langs) {
    const short = String(lang).toLowerCase().split("-")[0];
    if (i18n[short]) {
      return short;
    }
  }

  return "en";
}

const t = i18n[detectLanguage()];

function isStoredA11yEnabled() {
  const value = localStorage.getItem(a11yStorageKey);
  if (value === "on") return true;
  if (value === "off") return false;

  if (window.matchMedia && window.matchMedia("(prefers-contrast: more)").matches) {
    return true;
  }

  return false;
}

function setA11yMode(enabled) {
  document.body.classList.toggle("a11y-mode", enabled);
  a11yToggle.setAttribute("aria-pressed", String(enabled));
  a11yToggle.textContent = enabled ? t.a11yOn : t.a11yOff;
  a11yToggle.setAttribute("aria-label", enabled ? t.a11yAriaOn : t.a11yAriaOff);
  localStorage.setItem(a11yStorageKey, enabled ? "on" : "off");
}

function applyTranslations() {
  document.documentElement.lang = t.htmlLang;
  chipText.textContent = t.chip;
  titleText.textContent = t.title;
  leadText.textContent = t.lead;
  nameLabel.textContent = t.nameLabel;
  nameInput.placeholder = t.namePlaceholder;
  messageLabel.textContent = t.messageLabel;
  messageInput.placeholder = t.messagePlaceholder;
  submitBtn.textContent = t.submit;
}

function showStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = "status";
  if (kind) {
    statusEl.classList.add(`is-${kind}`);
  }
}

function validationText(reason) {
  if (reason === "validation_name_length") {
    return t.validationNameLength;
  }

  if (reason === "validation_message_length") {
    return t.validationMessageLength;
  }

  if (reason === "validation_message_forbidden") {
    return t.validationMessageForbidden;
  }

  return t.validationFallback;
}

applyTranslations();
setA11yMode(isStoredA11yEnabled());

a11yToggle.addEventListener("click", () => {
  const enabled = document.body.classList.contains("a11y-mode");
  setA11yMode(!enabled);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  showStatus(t.sending, "warning");
  submitBtn.disabled = true;

  try {
    const res = await fetch("/api/congrats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message })
    });

    const data = await res.json().catch(() => ({}));

    if ((data.ok === true || data.success === true) && res.ok) {
      showStatus(t.sent, "success");
      form.reset();
      return;
    }

    if (res.status === 409 || data.error === "ip_used") {
      showStatus(t.ipUsed, "warning");
      return;
    }

    if (res.status === 400 || data.error === "validation") {
      showStatus(validationText(data.reason), "error");
      return;
    }

    if (res.status === 429 || data.error === "rate_limited") {
      showStatus(t.rateLimited, "error");
      return;
    }

    if (res.status === 500 || data.error === "telegram_failed") {
      showStatus(t.telegramFailed, "error");
      return;
    }

    showStatus(t.unknownError, "error");
  } catch (error) {
    showStatus(t.networkError, "error");
  } finally {
    submitBtn.disabled = false;
  }
});
