const weddingDate = new Date("2026-08-08T16:00:00+04:00");
const formEndpoint = "";

const timer = document.querySelector("#timer");
const form = document.querySelector("#rsvp-form");
const statusEl = document.querySelector("#form-status");

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateTimer() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const values = [days, hours, minutes, seconds];

  timer.querySelectorAll("strong").forEach((node, index) => {
    node.textContent = index === 0 ? values[index] : pad(values[index]);
  });
}

function collectFormData(formNode) {
  const data = new FormData(formNode);
  const drinks = data.getAll("drinks");
  data.delete("drinks");
  data.append("drinks", drinks.join(", "));
  return data;
}

form.addEventListener("submit", async (event) => {
  if (!formEndpoint) {
    statusEl.textContent = "Для онлайн-отправки укажите endpoint формы в script.js.";
    return;
  }

  event.preventDefault();
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  statusEl.textContent = "Отправляем...";

  try {
    const response = await fetch(formEndpoint, {
      method: "POST",
      body: collectFormData(form),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Form request failed");

    form.reset();
    statusEl.textContent = "Спасибо! Ваш ответ отправлен.";
  } catch {
    statusEl.textContent = "Не получилось отправить. Попробуйте еще раз чуть позже.";
  } finally {
    submitButton.disabled = false;
  }
});

updateTimer();
setInterval(updateTimer, 1000);
