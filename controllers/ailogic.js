const fs = require('fs');
const path = require('path');

const analyzePerformance = (user_id, performances) => {
  const userPerformances = performances.filter(p => p.user_id == user_id);
  if (userPerformances.length === 0) {
    return { recommendation: 'Mulai dengan materi dasar.', next_question: null };
  }
  
  const avgTime = userPerformances.reduce((sum, p) => sum + p.response_time, 0) / userPerformances.length;
  if (avgTime > 60) {
    const lastQuestionId = userPerformances[userPerformances.length - 1].question_id;
    return { recommendation: 'Waktu respons lambat. Coba soal mirip.', next_question: lastQuestionId };
  }
  
  const errorCounts = {};
  userPerformances.filter(p => !p.is_correct).forEach(p => {
    errorCounts[p.error_type] = (errorCounts[p.error_type] || 0) + 1;
  });
  if (errorCounts.sign_error > 2) {
    return { recommendation: 'Banyak kesalahan tanda. Pelajari ulang operasi aljabar.', next_question: null };
  } else if (errorCounts.distribution_error > 2) {
    return { recommendation: 'Banyak kesalahan distribusi. Pelajari ulang bentuk formal.', next_question: null };
  }
  
  const correctRate = userPerformances.filter(p => p.is_correct).length / userPerformances.length;
  if (correctRate > 0.8) {
    return { recommendation: 'Performa baik! Tingkatkan kesulitan.', next_question: null };
  }
  
  return { recommendation: 'Lanjutkan latihan.', next_question: null };
};

const getAdaptiveQuestion = (user_id, material_id, difficulty, performances) => {
  const analysis = analyzePerformance(user_id, performances);
  const data = fs.readFileSync(path.join(__dirname, '../data/soal.json'), 'utf8');
  const questions = JSON.parse(data).soal; // <-- akses array soal

  if (analysis.next_question) {
    return questions.find(q => q.id == analysis.next_question);
  }

  const filtered = questions.filter(q => q.material_id == material_id && q.difficulty === difficulty);
  return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : null;
};

module.exports = { analyzePerformance, getAdaptiveQuestion };
