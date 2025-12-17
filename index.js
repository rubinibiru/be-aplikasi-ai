// backend/index.js (VERSI ANTI-CRASH / STABIL)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// --- KONFIGURASI DATABASE PINTAR ---
// ==========================================
const mongoString = "mongodb+srv://ainayahalfatihah2004_db_user:ebOIJsyNW9BxqN7n@cluster0.vgu1anq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Fungsi Koneksi Cerdas (Mencegah Timeout di Vercel)
const connectDB = async () => {
  // Cek status dulu: 0=mati, 1=nyala, 2=lagi loading
  if (mongoose.connection.readyState === 1) {
    console.log("⚡ Menggunakan koneksi database yang sudah ada.");
    return;
  }

  try {
    await mongoose.connect(mongoString, {
      serverSelectionTimeoutMS: 5000, // Maksimal nunggu 5 detik
      socketTimeoutMS: 45000, // Timeout socket
    });
    console.log('✅ BERHASIL KONEK KE DATABASE MONGODB BARU');
  } catch (err) {
    console.error('❌ GAGAL KONEK:', err);
    // Kita tidak throw error supaya server tidak crash total
  }
};

// Middleware: Pastikan database nyala sebelum memproses request apapun
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ==========================================
// --- ROUTE UTAMA ---
// ==========================================

// Route Cek Status Server
app.get('/', (req, res) => {
  const statusDB = mongoose.connection.readyState === 1 ? '✅ DB Konek' : '❌ DB Mati';
  res.send(`Server Backend Aman Jaya! 🚀 Status: ${statusDB}`);
});

const refleksiRoutes = require('./routes/refleksiRoutes');

// Import data JSON (Materi aman dibaca dari file lokal)
const dataMateri = require('./data/materi.json'); 
const materi = dataMateri.materi || dataMateri;

// Import route AI & User
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');

// Import Route Soal BARU
const soalRoutes = require('./routes/soalRoutes'); 

// --- Route materi ---
app.get('/materi', (req, res) => {
  res.json(materi);
});

app.get('/materi/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = materi.find(m => Number(m.id) === id);

  if (!item) {
    return res.status(404).json({ message: 'Materi tidak ditemukan' });
  }
  res.json(item);
});

// --- Route Soal ---
app.use('/soal', soalRoutes);

// --- Route Lainnya ---
app.use('/ai', aiRoutes);
app.use('/user', userRoutes);
app.use('/refleksi', refleksiRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));