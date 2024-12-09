from flask import Flask, send_from_directory, jsonify, render_template, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Разрешение запросов с клиентского домена
socketio = SocketIO(app, cors_allowed_origins="*")  # WebSocket поддержка CORS

# Хранение состояния сервера
server_status = {"status": False}
admin_logged_in = False  # Флаг авторизации администратора

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html", admin_logged_in=admin_logged_in)

# Получение статуса
@app.route("/status", methods=["GET"])
def get_status():
    return jsonify(server_status)

# Изменение статуса
@app.route("/status", methods=["POST"])
def update_status():
    global server_status, admin_logged_in
    auth_header = request.headers.get("Authorization")
    if auth_header == "Bearer YOUR_TOKEN":  # Замените YOUR_TOKEN на реальный токен
        data = request.get_json()
        if "status" in data:
            server_status["status"] = data["status"]
            socketio.emit("status_updated", server_status)
            return jsonify({"success": True, "status": server_status["status"]})
    return jsonify({"success": False, "error": "Unauthorized"}), 403

# Логин администратора
@app.route("/login", methods=["POST"])
def login_admin():
    global admin_logged_in
    data = request.get_json()
    password = data.get("password")
    if password == "admin123":  # Правильный пароль
        admin_logged_in = True
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid password"}), 403

# Маршрут для скачивания файлов
@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    try:
        return send_from_directory(os.getcwd(), filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({"success": False, "error": "File not found"}), 404

# Обработчик для обработки событий с клиента (WebSocket)
@socketio.on("connect")
def handle_connect():
    print("Client connected")
    emit("status_updated", server_status)

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
