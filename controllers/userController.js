const jwt = require('jsonwebtoken');

// --- DATABASE SEMENTARA (IN-MEMORY) ---
// Karena Vercel tidak bisa tulis file (fs.write), kita simpan di variable saja.
// Data ini akan reset kalau server restart/redeploy, tapi cukup untuk DEMO tugas.

let users = [
  { 
    id: 1, 
    username: "siswa1", 
    password: "password123", 
    name: "Siswa 1", 
    level: "Siswa Aktif" 
  }
];

const SECRET_KEY = "secretkey"; 

// --- CONTROLLER ---

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Cari user di variable array 'users', bukan load dari file
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
    
    // Cari user langsung dari variable memory
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({ id: user.id, username: user.username, name: user.name, level: user.level || "Siswa Baru" });
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

exports.register = (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "Semua data harus diisi!" });
  }

  // Cek username di memory
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username sudah terpakai, coba yang lain." });
  }

  // Buat User Baru
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1, 
    username,
    password, 
    name,
    level: "Siswa Baru",
    joinedAt: new Date().toISOString()
  };

  // Simpan ke MEMORY (Push ke array)
  // Tidak pakai fs.writeFileSync lagi
  users.push(newUser);

  console.log("User baru terdaftar (di memory):", newUser.username);

  res.status(201).json({ success: true, message: "Registrasi berhasil!", user: newUser });
};