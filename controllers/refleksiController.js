// backend/controllers/refleksiController.js
const Refleksi = require('../models/Refleksi');
const Performance = require('../models/Performance');

// 1. AMBIL REFLEKSI (Teks)
exports.getReflection = async (req, res) => {
    try {
        const { user_id } = req.params;
        const dataRefleksi = await Refleksi.find({ user_id }).sort({ tanggal: -1 });
        res.json(dataRefleksi || []);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil refleksi" });
    }
};

// 2. SIMPAN REFLEKSI (Teks)
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

// 3. AMBIL PROGRESS (VERSI JUJUR & FINAL)
// Tidak ada lagi "Sulap" data di sini.
// backend/controllers/refleksiController.js

// ... kode atas biarkan ...

exports.getUserProgress = async (req, res) => {
    try {
        // 1. Tangkap ID dari Frontend
        // (Pastikan di database user_id tipenya Number/Int. Kalau String, hapus parseInt)
        const requestedUserId = parseInt(req.params.user_id);

        console.log(`🔍 Checking Database for User ID: ${requestedUserId}`);

        // 2. QUERY DATABASE (INI KUNCINYA!)
        // ❌ SALAH: await Performance.find();  <-- Ini mengambil SEMUA data orang
        // ✅ BENAR: await Performance.find({ user_id: requestedUserId }); <-- Filter punya dia saja
        
        const progressData = await Performance.find({ user_id: requestedUserId });

        // Cek apakah data user lain ikut masuk?
        // Kita filter manual lagi di sini buat jaga-jaga (Double Protection)
        const finalData = progressData.filter(item => item.user_id === requestedUserId);
        
        console.log(`✅ Ditemukan ${finalData.length} data murni milik User ${requestedUserId}`);
        
        res.json(finalData);

    } catch (error) {
        console.error("Error ambil progress:", error);
        res.status(500).json({ message: error.message });
    }
};