const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    // Sesuaikan ini dengan data yang biasa dikirim dari frontend kamu
    materiId: { type: String, required: true },
    jawabanUser: { type: Array, default: [] }, // Menyimpan jawaban [A, B, C...]
    skor: { type: Number, default: 0 },
    tanggal: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);