// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { analyzePerformance, getAdaptiveQuestion } = require('../controllers/ailogic');

// Endpoint POST /ai/analyze
router.post('/analyze', (req, res) => {
  const { user_id, performances } = req.body;
  
  if (!user_id || !performances) {
    return res.status(400).json({ message: 'user_id dan performances harus diisi' });
  }

  const result = analyzePerformance(user_id, performances);
  res.json(result);
});

// Endpoint POST /ai/adaptive
router.post('/adaptive', (req, res) => {
  const { user_id, material_id, difficulty, performances } = req.body;

  if (!user_id || material_id === undefined || !difficulty || !performances) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const question = getAdaptiveQuestion(user_id, material_id, difficulty, performances);
  const analysis = analyzePerformance(user_id, performances);

  res.json({ analysis, next_question: question });
});

module.exports = router;
