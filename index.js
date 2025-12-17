// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Pastikan baris ini ada
const app = express();

// --- BAGIAN CORS (PENTING) ---
app.use(cors()); 
app.use(express.json());
// Tambahkan ini supaya kalau dibuka link utamanya, muncul tulisan
app.get('/', (req, res) => {
    res.send('Server Backend Aman Jaya! 🚀');
});
// ==========================================
// --- BAGIAN DATABASE (TAMBAHAN BARU) ---
// ==========================================
const mongoString = "mongodb+srv://ainayahalfatihah2004_db_user:ebOIJsyNW9BxqN7n@cluster0.vgu1anq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoString)
  .then(() => console.log('✅ BERHASIL KONEK KE DATABASE MONGODB'))
  .catch((err) => console.log('❌ GAGAL KONEK:', err));
// ==========================================

const refleksiRoutes = require('./routes/refleksiRoutes');

// Import data JSON (Untuk materi aman pakai JSON karena cuma dibaca/read)
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

// Jalankan server (Ganti ke process.env.PORT supaya aman di Vercel)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));