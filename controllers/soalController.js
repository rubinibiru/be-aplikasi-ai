// backend/controllers/soalController.js
const path = require("path");

// 1. Panggil Model MongoDB yang baru dibuat
const Performance = require('../models/Performance'); 

// Load Soal dari file JSON 
// (Untuk MEMBACA data, cara ini AMAN dan BOLEH di Vercel)
let dataSoal;
try {
  dataSoal = require("../data/soal.json");
} catch (err) {
  dataSoal = { soal: [] };
}

// --- BAGIAN 1: AMBIL SOAL (Tetap sama, aman) ---
exports.getSoal = (req, res) => {
  const materiId = parseInt(req.params.materiId);
  // Cek struktur JSON, handle berbagai kemungkinan struktur
  const listSoal = dataSoal.soal || dataSoal.materi || dataSoal; 
  
  const materiFound = Array.isArray(listSoal) ? listSoal.find(m => m.id === materiId) : null;

  if (!materiFound) return res.status(404).json({ message: "Materi tidak ditemukan" });
  res.json(materiFound.soal);
};

// --- BAGIAN 2: CEK JAWABAN (Tetap sama, logic saja) ---
exports.submitSoal = (req, res) => {
  const materiId = parseInt(req.params.materiId);
  const jawabanUser = req.body.jawaban; 
  
  const listSoal = dataSoal.soal || dataSoal.materi || dataSoal;
  const materiFound = Array.isArray(listSoal) ? listSoal.find(m => m.id === materiId) : null;

  if (!materiFound) return res.status(404).json({ message: "Materi tidak ditemukan" });

  let score = 0;
  materiFound.soal.forEach(item => {
    // Pastikan jawabanUser ada isinya untuk nomor tersebut
    if (jawabanUser[item.nomor] && jawabanUser[item.nomor].toUpperCase() === item.jawaban.toUpperCase()) {
      score++;
    }
  });

  res.json({ total: materiFound.soal.length, benar: score });
};

// --- BAGIAN 3: SIMPAN PROGRESS (INI YANG KITA PERBAIKI) ---
// Kita ubah jadi ASYNC karena database butuh waktu
exports.saveProgress = async (req, res) => {
  try {
    const { user_id, question_id, is_correct, difficulty, time_taken } = req.body;

    // Siapkan data untuk MongoDB
    const newEntry = new Performance({
      user_id: user_id || 1, 
      question_id: question_id,
      material_id: 1, 
      difficulty: difficulty || "MEDIUM",
      response_time: time_taken || 0,
      is_correct: is_correct
      // Timestamp otomatis dibuat oleh MongoDB (default: Date.now)
    });

    // SIMPAN KE MONGODB ATLAS (CLOUD)
    const hasilSimpan = await newEntry.save();

    console.log("✅ Progress berhasil disimpan ke MongoDB Atlas!");
    res.json({ success: true, message: "Progress saved!", data: hasilSimpan });

  } catch (error) {
    console.error("❌ Gagal simpan ke database:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};