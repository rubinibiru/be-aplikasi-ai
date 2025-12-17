// routes/refleksiRoutes.js
const express = require('express');
const router = express.Router();
// Import controller yang baru kita update
const { getReflection, saveReflection } = require('../controllers/refleksiController');

// Pintu ambil data
router.get('/:user_id', getReflection);

// Pintu simpan data (INI YANG KEMARIN HILANG)
router.post('/save', saveReflection);

module.exports = router;