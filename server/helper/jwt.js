const jwt = require('jsonwebtoken')

// JWT helper functions
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId, type: 'access' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        { expiresIn: '7d' }
    )

    return { accessToken, refreshToken }
}

module.exports = {
    generateTokens
}