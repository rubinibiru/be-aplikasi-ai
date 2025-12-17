// backend/controllers/refleksiController.js
const { analyzePerformance } = require('./ailogic');
const storage = require('../storage'); // <--- Panggil Kotak Penyimpanan yang SAMA

exports.getReflection = (req, res) => {
  const user_id = Number(req.params.user_id);

  // --- AMBIL DATA DARI KOTAK PENYIMPANAN ---
  const performances = storage.performances;
  // -----------------------------------------

  console.log("Mengecek refleksi untuk user:", user_id);
  console.log("Total data performance tersedia:", performances.length);

  const userPerformances = performances.filter(p => p.user_id === user_id);
  const total = userPerformances.length;
  const benar = userPerformances.filter(p => p.is_correct).length;
  const salah = total - benar;

  // AI Logic (Bungkus try-catch biar gak crash kalau file AI error)
  let analysis = { recommendation: "Latihan terus ya!" };
  try {
      if (analyzePerformance) {
        analysis = analyzePerformance(user_id, userPerformances);
      }
  } catch (e) { console.log("AI Skip"); }

  // Refleksi per materi
  const materiIds = [...new Set(userPerformances.map(p => p.material_id))];
  const refleksiPerMateri = materiIds.map(mid => {
    const perfMateri = userPerformances.filter(p => p.material_id === mid);
    const benarMateri = perfMateri.filter(p => p.is_correct).length;
    const salahMateri = perfMateri.length - benarMateri;
    
    let rekomendasiMateri = salahMateri > 2 ? 'Pelajari ulang.' : 'Lanjut materi sulit.';
    
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
