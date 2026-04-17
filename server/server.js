const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load routes
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const uploadRoutes = require('./routes/upload');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static images correctly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nagarsetu';

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error. Check your Atlas Network IP whitelist!', err);
});
