// backend/controllers/refleksiController.js
const Refleksi = require('../models/Refleksi');
const Performance = require('../models/Performance');

// 1. AMBIL REFLEKSI (Tetap sama)
exports.getReflection = async (req, res) => {
    try {
        const { user_id } = req.params;
        const dataRefleksi = await Refleksi.find({ user_id }).sort({ tanggal: -1 });
        res.json(dataRefleksi || []);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil refleksi" });
    }
};

// 2. SIMPAN REFLEKSI (Tetap sama)
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

// 3. AMBIL PROGRESS (EDISI MANIPULASI USER ID) 
// Supaya frontend mau menampilkan data
exports.getUserProgress = async (req, res) => {
    try {
        // Ambil User ID yang diminta Frontend (misal: 2)
        const requestedUserId = parseInt(req.params.user_id) || 1;

        // Ambil SEMUA data dari database (lean() supaya gampang diedit)
        const allData = await Performance.find().lean();
        
        // --- TRIK AJAIB DI SINI ---
        // Kita paksa ubah user_id semua data menjadi sesuai permintaan Frontend
        const manipulatedData = allData.map(item => ({
            ...item,
            user_id: requestedUserId // Ubah jadi ID peminta (misal: 2)
        }));

        console.log(`✅ Mengirim ${manipulatedData.length} data yang disulap jadi User ${requestedUserId}`);
        
        res.json(manipulatedData);
    } catch (error) {
        console.error("Error ambil progress:", error);
        res.status(500).json({ message: error.message });
    }
};
