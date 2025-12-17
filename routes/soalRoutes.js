// backend/routes/soalRoutes.js
const express = require('express');
const router = express.Router();

// Import controller yang baru kita buat di atas
const soalController = require('../controllers/soalController');

// --- DAFTAR PINTU (ROUTES) ---

// 1. Pintu untuk Ambil Soal (misal: /soal/0 untuk Easy)
router.get('/:materiId', soalController.getSoal);

// 2. Pintu untuk Submit Jawaban (Logic lama temanmu)
router.post('/:materiId/submit', soalController.submitSoal);

// 3. Pintu Dummy Filter (Supaya gak error kalau frontend manggil ini)
router.get('/:materiId/:difficulty', (req, res) => {
  // Balikin array kosong dulu biar aman
  res.json([]); 
});

// 4. PINTU UTAMA: SIMPAN PROGRESS
// Ini yang dipanggil sama frontend kamu saat klik "Jawab"
router.post('/save', soalController.saveProgress);

module.exports = router;