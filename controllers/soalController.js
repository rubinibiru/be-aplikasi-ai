// backend/controllers/soalController.js
const fs = require("fs");
const path = require("path");

// --- SETUP PATH FILE ---
// Kita tentukan di mana file soal dan file nilai disimpan
const soalPath = path.join(__dirname, "../data/soal.json");
const perfPath = path.join(__dirname, "../data/performances.json");

// Helper: Baca File Soal dengan Aman
const loadSoal = () => {
  try {
    const raw = fs.readFileSync(soalPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Gagal baca soal.json:", err);
    return { soal: [] }; // Return kosong biar gak crash
  }
};

// Helper: Baca File Performance (Nilai)
const loadPerf = () => {
  try {
    if (!fs.existsSync(perfPath)) {
      // Kalau file belum ada, kita anggap kosong
      return { performances: [] };
    }
    return JSON.parse(fs.readFileSync(perfPath, "utf-8"));
  } catch (err) {
    return { performances: [] };
  }
};

// --- 1. AMBIL SOAL (GET) ---
exports.getSoal = (req, res) => {
  const materiId = parseInt(req.params.materiId);
  const data = loadSoal();

  // Handle struktur JSON temanmu (kadang pakai 'soal', kadang array langsung)
  const listSoal = data.soal || data.materi || data; 

  // Cari materi/level berdasarkan ID
  const materiFound = Array.isArray(listSoal) ? listSoal.find(m => m.id === materiId) : null;

  if (!materiFound) {
    // Fallback: Coba cari di root jika struktur berbeda
    return res.status(404).json({ message: "Materi tidak ditemukan" });
  }

  // Kirim isinya (array pertanyaan)
  res.json(materiFound.soal);
};

// --- 2. CEK JAWABAN (SUBMIT) ---
exports.submitSoal = (req, res) => {
  const materiId = parseInt(req.params.materiId);
  const jawabanUser = req.body.jawaban; 

  const data = loadSoal();
  const listSoal = data.soal || data.materi || data;
  const materiFound = listSoal.find(m => m.id === materiId);

  if (!materiFound) return res.status(404).json({ message: "Materi tidak ditemukan" });

  let score = 0;
  materiFound.soal.forEach(item => {
    if (jawabanUser[item.nomor] && jawabanUser[item.nomor].toUpperCase() === item.jawaban.toUpperCase()) {
      score++;
    }
  });

  res.json({ total: materiFound.soal.length, benar: score });
};

// --- 3. SIMPAN PROGRESS (INI YANG WAJIB ADA) ---
exports.saveProgress = (req, res) => {
  // Ambil data yang dikirim dari Frontend
  const { user_id, question_id, is_correct, difficulty, time_taken } = req.body;

  console.log("Menerima data save:", req.body); // Cek di terminal backend

  // 1. Baca data lama
  const dataPerf = loadPerf();
  
  // 2. Siapkan data baru
  const newEntry = {
    user_id: user_id || 1, // Default user 1
    question_id: question_id,
    material_id: 1, // Default materi 1
    difficulty: difficulty || "MEDIUM",
    response_time: time_taken || 0,
    is_correct: is_correct,
    error_type: is_correct ? null : "general_error",
    timestamp: new Date().toISOString()
  };

  // 3. Masukkan ke array
  if (!dataPerf.performances) {
    dataPerf.performances = [];
  }
  dataPerf.performances.push(newEntry);

  // 4. Tulis balik ke file (Simpan Permanen)
  try {
    fs.writeFileSync(perfPath, JSON.stringify(dataPerf, null, 2));
    res.json({ success: true, message: "Progress berhasil disimpan!", data: newEntry });
  } catch (err) {
    console.error("Gagal nulis file:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan ke server." });
  }
};