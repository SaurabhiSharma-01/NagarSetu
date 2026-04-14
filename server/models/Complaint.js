const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Road', 'Water', 'Electricity', 'Waste', 'Other'], required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
