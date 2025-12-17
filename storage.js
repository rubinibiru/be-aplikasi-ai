// backend/storage.js

// Ini adalah "Database Darurat" yang hidup di RAM.
// Semua controller akan simpan dan ambil data dari sini.
const storage = {
    users: [],
    performances: [], // Ini tempat nyimpen nilai/jawaban soal
    refleksi: []
};

module.exports = storage;