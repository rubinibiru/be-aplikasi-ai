const mongoose = require('mongoose');

const refleksiSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // ID user (bisa angka/string)
    materi_id: { type: String, default: "1" }, // ID materi terkait
    isi_refleksi: { type: String, required: true }, // Tulisan refleksinya
    tanggal: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Refleksi', refleksiSchema);