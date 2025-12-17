// backend/controllers/refleksiController.js
const Refleksi = require('../models/Refleksi');
const Performance = require('../models/Performance'); // <-- Panggil Model Nilai

// 1. AMBIL DATA REFLEKSI (Teks Refleksi)
exports.getReflection = async (req, res) => {
    try {
        const { user_id } = req.params;
        const dataRefleksi = await Refleksi.find({ user_id }).sort({ tanggal: -1 });
        res.json(dataRefleksi || []);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil refleksi" });
    }
};

// 2. SIMPAN DATA REFLEKSI
exports.saveReflection = async (req, res) => {
    try {
        const { user_id, isi_refleksi, materi_id } = req.body;
        const dataBaru = new Refleksi({
            user_id: user_id || "1",
            materi_id: materi_id || "1",
            isi_refleksi: isi_refleksi
        });
        const hasil = await dataBaru.save();
        res.json({ success: true, data: hasil });
    } catch (error) {
        res.status(500).json({ message: "Gagal simpan refleksi" });
    }
};

// backend/controllers/refleksiController.js

// ... (bagian atas tetap sama)

// 3. AMBIL PROGRESS (EDISI PERBAIKAN: AMBIL SEMUA)
exports.getUserProgress = async (req, res) => {
    try {
        // KITA HAPUS filter user_id-nya sementara.
        // Perintah .find() kosong artinya "Ambil semua data yang ada di database"
        const progressData = await Performance.find();
        
        // Kita kasih console.log biar bisa dipantau di Vercel Log
        console.log("✅ DATA DITEMUKAN:", progressData.length, "item");
        
        res.json(progressData);
    } catch (error) {
        console.error("Error ambil progress:", error);
        res.status(500).json({ message: error.message });
    }
};
