// backend/controllers/userController.js
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const usersPath = path.join(__dirname, '../data/users.json');
const SECRET_KEY = "secretkey"; // Harusnya di .env, tapi hardcode dulu gpp

// Helper: Baca User dari File
const loadUsers = () => {
  try {
    if (!fs.existsSync(usersPath)) {
      // Kalau file belum ada, buat file baru dengan user default
      const defaultUsers = [
        { id: 1, username: "siswa1", password: "password123", name: "Siswa 1", level: "Siswa Aktif" }
      ];
      fs.writeFileSync(usersPath, JSON.stringify(defaultUsers, null, 2));
      return defaultUsers;
    }
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper: Simpan User ke File
const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "24h" });
  res.json({ token });
};

exports.getProfile = (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const users = loadUsers();
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({ id: user.id, username: user.username, name: user.name, level: user.level || "Siswa Baru" });
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

// --- FITUR BARU: REGISTER ---
exports.register = (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "Semua data harus diisi!" });
  }

  const users = loadUsers();

  // Cek apakah username sudah dipakai
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username sudah terpakai, coba yang lain." });
  }

  // Buat User Baru
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1, // Auto Increment ID
    username,
    password, // Di dunia nyata ini harus di-hash (enkripsi), tapi buat belajar gpp plain text
    name,
    level: "Siswa Baru",
    joinedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ success: true, message: "Registrasi berhasil!", user: newUser });
};