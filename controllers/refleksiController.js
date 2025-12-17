// controllers/refleksiController.js
const { analyzePerformance } = require('./ailogic');
const fs = require('fs');
const path = require('path');

exports.getReflection = (req, res) => {
  const user_id = Number(req.params.user_id);

  const data = fs.readFileSync(path.join(__dirname, '../data/performances.json'), 'utf8');
  const performances = JSON.parse(data).performances || [];

  const userPerformances = performances.filter(p => p.user_id === user_id);

  const total = userPerformances.length;
  const benar = userPerformances.filter(p => p.is_correct).length;
  const salah = total - benar;

  const analysis = analyzePerformance(user_id, userPerformances);

  // Refleksi per materi
  const materiIds = [...new Set(userPerformances.map(p => p.material_id))];
  const refleksiPerMateri = materiIds.map(mid => {
    const perfMateri = userPerformances.filter(p => p.material_id === mid);
    const benarMateri = perfMateri.filter(p => p.is_correct).length;
    const salahMateri = perfMateri.length - benarMateri;

    let rekomendasiMateri = '';
    const avgTime = perfMateri.reduce((sum, p) => sum + p.response_time, 0) / perfMateri.length;
    if (avgTime > 60) {
      rekomendasiMateri = 'Waktu pengerjaan lama, latihan lebih banyak.';
    } else if (salahMateri > 2) {
      rekomendasiMateri = 'Banyak kesalahan, pelajari materi ulang.';
    } else {
      rekomendasiMateri = 'Performa baik, bisa lanjut ke soal lebih sulit.';
    }

    return {
      material_id: mid,
      total: perfMateri.length,
      benar: benarMateri,
      salah: salahMateri,
      rekomendasi: rekomendasiMateri
    };
  });

  res.json({
    total_soal: total,
    jawaban_benar: benar,
    jawaban_salah: salah,
    recommendation: analysis.recommendation,
    refleksi_per_materi: refleksiPerMateri
  });
};
