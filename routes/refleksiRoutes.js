// backend/routes/refleksiRoutes.js
const express = require('express');
const router = express.Router();
const { getReflection, saveReflection } = require('../controllers/refleksiController');

// --- UPDATE DI SINI ---

// 1. Jalur Biasa (Ambil Refleksi berdasarkan User ID)
router.get('/:user_id', getReflection);

// 2. [TAMBAHAN BARU] Jalur "Progress" (Supaya error 404 hilang)
// Kita arahkan request ini ke fungsi yang sama (getReflection)
router.get('/progress/:user_id', getReflection);

// 3. Jalur Simpan (PENTING: Pastikan frontend kirim ke /refleksi/save)
router.post('/save', saveReflection);

module.exports = router;