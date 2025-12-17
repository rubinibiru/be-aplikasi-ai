// backend/controllers/refleksiController.js
const Refleksi = require('../models/Refleksi');

// 1. AMBIL REFLEKSI (GET)
exports.getReflection = async (req, res) => {
    try {
        const { user_id } = req.params;
        
        // Cari di database MongoDB berdasarkan user_id
        // .sort({ tanggal: -1 }) artinya yang paling baru muncul duluan
        const dataRefleksi = await Refleksi.find({ user_id }).sort({ tanggal: -1 });

        // Kalau kosong, kembalikan array kosong (biar frontend gak error)
        if (!dataRefleksi) {
            return res.json([]);
        }

        res.json(dataRefleksi);
    } catch (error) {
        console.error("Error ambil refleksi:", error);
        res.status(500).json({ message: "Gagal mengambil data refleksi" });
    }
};

// 2. SIMPAN REFLEKSI BARU (POST) - Tambahan Penting!
exports.saveReflection = async (req, res) => {
    try {
        const { user_id, isi_refleksi, materi_id } = req.body;

        const dataBaru = new Refleksi({
            user_id: user_id || "1", // Default user 1 kalau gak ada
            materi_id: materi_id || "1",
            isi_refleksi: isi_refleksi
        });

        const hasil = await dataBaru.save();
        
        res.json({ success: true, data: hasil });
    } catch (error) {
        console.error("Error simpan refleksi:", error);
        res.status(500).json({ message: "Gagal menyimpan refleksi" });
    }
};
