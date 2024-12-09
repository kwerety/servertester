// Правильный пароль для админ-панели
const correctPassword = "admin123";

// URL сервера для взаимодействия
const API_URL = "https://servertester.onrender.com";

// Загрузка статуса сервера
async function fetchStatus() {
  try {
    const response = await fetch(`${API_URL}/status`);
    const data = await response.json();
    const status = data.status;

    document.getElementById("toggle-switch").checked = status;
    document.getElementById("status-text").innerText = `Status: ${status ? "ON" : "OFF"}`;
  } catch (error) {
    document.getElementById("status-text").innerText = "Status: Error fetching status";
    console.error("Error fetching server status:", error);
  }
}

// Обновление статуса сервера
async function updateStatus(newStatus) {
  try {
    await fetch(`${API_URL}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    document.getElementById("status-text").innerText = `Status: ${newStatus ? "ON" : "OFF"}`;
  } catch (error) {
    console.error("Error updating server status:", error);
  }
}

// Открытие админ-панели
function openAdmin() {
  document.getElementById("admin-panel").classList.add("active");
}

// Проверка пароля в админ-панели
function loginAdmin() {
  const passwordField = document.getElementById("admin-password");
  const adminPanel = document.getElementById("admin-panel");
  const errorMsg = document.getElementById("error-msg");

  if (passwordField.value === correctPassword) {
    document.getElementById("toggle-switch").disabled = false;
    adminPanel.classList.add("fadeOut");
    setTimeout(() => adminPanel.classList.remove("active", "fadeOut"), 500);
  } else {
    errorMsg.style.display = "block";
  }
}

// Переключение темы
document.getElementById("theme-switch").addEventListener("click", function () {
  const body = document.body;
  body.classList.toggle("dark-theme");

  this.innerHTML = body.classList.contains("dark-theme")
    ? '<span id="theme-icon">🌙</span> Switch to Light Theme'
    : '<span id="theme-icon">🌞</span> Switch to Dark Theme';
});

// Обновление статуса при изменении переключателя
document.getElementById("toggle-switch").addEventListener("change", function () {
  updateStatus(this.checked);
});

// Скачивание файлов
function downloadFile(fileName) {
  const downloadUrl = `${API_URL}/download/${fileName}`;
  window.location.href = downloadUrl;
}

// Загрузка начального состояния
fetchStatus();
