// index.js
const express = require('express');
const cors = require('cors');
const refleksiRoutes = require('./routes/refleksiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
    origin: 'https://link-netlify-temanmu.netlify.app', // Ganti dengan link temanmu
    optionsSuccessStatus: 200
}));

// Import data JSON (Untuk Materi masih pakai cara manual temanmu)
const dataMateri = require('./data/materi.json'); 
const materi = dataMateri.materi || dataMateri;

// --- BAGIAN INI DIPINDAAHKAN KE CONTROLLER BARU ---
// Kita tidak perlu import dataSoal di sini lagi karena sudah diurus soalController.js
// --------------------------------------------------

// Import route AI & User
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');

// Import Route Soal BARU (Yang punya fitur Save)
const soalRoutes = require('./routes/soalRoutes'); 

// --- Route materi (Biarkan cara temanmu yang lama biar aman) ---
app.get('/materi/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = materi.find(m => Number(m.id) === id);

  if (!item) {
    return res.status(404).json({ message: 'Materi tidak ditemukan' });
  }

  res.json(item);
});

// --- Route Soal (INI YANG DIUBAH) ---
// Kita ganti codingan panjang temanmu dengan satu baris ini.
// Jadi semua urusan soal (ambil soal & simpan jawaban) diurus oleh soalRoutes.js
app.use('/soal', soalRoutes);

// --- Route Lainnya ---
app.use('/ai', aiRoutes);  // semua endpoint dari aiRoutes sekarang tersedia di /ai
app.use('/user', userRoutes);
app.use('/refleksi', refleksiRoutes);

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));