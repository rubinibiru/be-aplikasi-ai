// routes/refleksiRoutes.js
const express = require('express');
const router = express.Router();
const { getReflection } = require('../controllers/refleksiController');

router.get('/:user_id', getReflection);

module.exports = router;
