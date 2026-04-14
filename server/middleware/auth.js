const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'No authentication token, authorization denied.' });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.id;
        req.userRole = verified.role;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token verification failed, authorization denied.' });
    }
};

const authAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ msg: 'Admin resources access denied.' });
    }
    next();
}

module.exports = { auth, authAdmin };
