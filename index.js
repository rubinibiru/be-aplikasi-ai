// index.js
const express = require('express');
const cors = require('cors');
const app = express();

// --- BAGIAN CORS (PENTING) ---
// Pakai yang ini saja (Buka untuk semua).
// Yang bagian ada "link-netlify" tadi HAPUS saja biar tidak bentrok.
app.use(cors()); 
// -----------------------------

app.use(express.json());

const refleksiRoutes = require('./routes/refleksiRoutes');

// Import data JSON 
const dataMateri = require('./data/materi.json'); 
const materi = dataMateri.materi || dataMateri;

// Import route AI & User
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');

// Import Route Soal BARU
const soalRoutes = require('./routes/soalRoutes'); 

// --- Route materi ---
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
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));