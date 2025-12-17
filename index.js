// backend/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// --- KONEKSI DATABASE "GLOBAL CACHING" ---
// ==========================================
const mongoString = "mongodb+srv://ainayahalfatihah2004_db_user:ebOIJsyNW9BxqN7n@cluster0.vgu1anq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Trik ini mencegah Vercel membuat koneksi ganda (Zombie Connection)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("⚡ Memakai koneksi database yang sudah aktif.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Penting: Jangan antri kalau putus, langsung error aja biar jelas
      serverSelectionTimeoutMS: 5000, // Timeout 5 detik
      socketTimeoutMS: 45000,
    };

    console.log("🔄 Membuka koneksi baru ke MongoDB...");
    cached.promise = mongoose.connect(mongoString, opts).then((mongoose) => {
      console.log("✅ Database Connected!");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset kalau gagal biar bisa coba lagi
    console.error("❌ Gagal Konek:", e);
    throw e;
  }

  return cached.conn;
};

// Middleware: Pastikan DB Konek sebelum lanjut
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Error:", error);
    // Tetap lanjut tapi kasih info error di log, jangan bikin aplikasi crash total
    res.status(500).json({ message: "Database sedang sibuk, coba refresh.", error: error.message });
  }
});

// ==========================================
// --- ROUTES ---
// ==========================================

// Route Cek Status
app.get('/', (req, res) => {
  res.send(`Server Backend Aman! Status DB: ${cached.conn ? 'Connected' : 'Connecting...'}`);
});

const refleksiRoutes = require('./routes/refleksiRoutes');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');
const soalRoutes = require('./routes/soalRoutes'); 

// Data Materi (JSON)
const dataMateri = require('./data/materi.json'); 
const materi = dataMateri.materi || dataMateri;

// --- Route Handlers ---
app.get('/materi', (req, res) => res.json(materi));
app.get('/materi/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = materi.find(m => Number(m.id) === id);
  if (!item) return res.status(404).json({ message: 'Materi tidak ditemukan' });
  res.json(item);
});

app.use('/soal', soalRoutes);
app.use('/ai', aiRoutes);
app.use('/user', userRoutes);
app.use('/refleksi', refleksiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));