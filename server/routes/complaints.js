const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { auth, authAdmin } = require('../middleware/auth');

// Create a complaint (User only)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, location, imageUrl } = req.body;
        const newComplaint = new Complaint({
            title,
            description,
            category,
            location,
            imageUrl,
            userId: req.user
        });
        const savedComplaint = await newComplaint.save();
        res.status(201).json(savedComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all complaints (Admin: all, User: own)
router.get('/', auth, async (req, res) => {
    try {
        let complaints;
        if (req.userRole === 'admin') {
            complaints = await Complaint.find().populate('userId', 'name email').sort({ createdAt: -1 });
        } else {
            complaints = await Complaint.find({ userId: req.user }).sort({ createdAt: -1 });
        }
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get specific complaint
router.get('/:id', auth, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });
        
        // Only admin or the owner can view
        if (req.userRole !== 'admin' && complaint.userId.toString() !== req.user) {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update complaint status (Admin only)
router.put('/:id', auth, authAdmin, async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });

        if (status) complaint.status = status;
        if (remarks) complaint.remarks = remarks;

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
