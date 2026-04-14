const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/nagarsetu')
.then(async () => {
    let user = await User.findOne({ email: 'admin@nagarsetu.com' });
    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);
        user = new User({
            name: 'Super Admin',
            email: 'admin@nagarsetu.com',
            password: passwordHash,
            role: 'admin'
        });
        await user.save();
        console.log("Admin created successfully!");
    } else {
        user.role = 'admin';
        user.password = await bcrypt.hash('admin123', await bcrypt.genSalt(10));
        await user.save();
        console.log("Admin user updated successfully!");
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
