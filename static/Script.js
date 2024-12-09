// Правильный пароль для админ-панели
const correctPassword = "admin123";

// URL сервера для взаимодействия
const API_URL = "https://servertester.onrender.com";
const socket = io(API_URL, { transports: ["websocket"] }); // Подключение через WebSocket

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
    const response = await fetch(`${API_URL}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
      document.getElementById("status-text").innerText = `Status: ${newStatus ? "ON" : "OFF"}`;
    } else {
      const errorData = await response.json();
      console.error("Error updating server status:", errorData.error);
    }
  } catch (error) {
    console.error("Error updating server status:", error);
  }
}

// Обработка WebSocket событий
socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("status_updated", (data) => {
  console.log("Status updated:", data);
  document.getElementById("toggle-switch").checked = data.status;
  document.getElementById("status-text").innerText = `Status: ${data.status ? "ON" : "OFF"}`;
});

socket.on("disconnect", () => {
  console.error("Disconnected from WebSocket server");
});

// Открытие админ-панели
function openAdmin() {
  document.getElementById("admin-panel").classList.add("active");
}

// Проверка пароля в админ-панели
async function loginAdmin() {
  const passwordField = document.getElementById("admin-password");
  const adminPanel = document.getElementById("admin-panel");
  const errorMsg = document.getElementById("error-msg");

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordField.value }),
    });

    if (response.ok) {
      document.getElementById("toggle-switch").disabled = false;
      adminPanel.classList.add("fadeOut");
      setTimeout(() => adminPanel.classList.remove("active", "fadeOut"), 500);
    } else {
      errorMsg.style.display = "block";
    }
  } catch (error) {
    console.error("Error during login:", error);
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
