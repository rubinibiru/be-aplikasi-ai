// backend/models/Performance.js
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    user_id: { type: Number, default: 1 },
    question_id: { type: Number, required: true },
    material_id: { type: Number, default: 1 },
    difficulty: { type: String, default: "MEDIUM" },
    response_time: { type: Number, default: 0 },
    is_correct: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Performance', performanceSchema);