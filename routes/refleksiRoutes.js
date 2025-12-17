// backend/routes/refleksiRoutes.js
const express = require('express');
const router = express.Router();
// Import getUserProgress juga
const { getReflection, saveReflection, getUserProgress } = require('../controllers/refleksiController');

// 1. Pintu Khusus Progress (Pakai fungsi getUserProgress)
router.get('/progress/:user_id', getUserProgress);

// 2. Pintu Ambil Refleksi
router.get('/:user_id', getReflection);

// 3. Pintu Simpan Refleksi
router.post('/save', saveReflection);

module.exports = router;