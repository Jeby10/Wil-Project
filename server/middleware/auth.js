const jwt = require("jsonwebtoken")
const { User } = require("../models/user")
// Auth middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'Access token required' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

        if (decoded.type !== 'access') {
            return res.status(401).json({ error: 'Invalid token type' })
        }

        const user = await User.findById(decoded.userId).select('-password')
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'User not found or inactive' })
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error?.message)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' })
        }
        return res.status(403).json({ error: 'Invalid token' })
    }
}
// Admin middleware
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' })
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' })
        }

        next()
    } catch (error) {
        return res.status(500).json({ error: 'Authorization error' })
    }
}

module.exports = { authenticateToken, isAdmin }
