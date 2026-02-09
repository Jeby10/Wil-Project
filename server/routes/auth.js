const express = require('express')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { User, Session } = require('../models/user')

const { authenticateToken } = require('../middleware/auth')
const { generateTokens } = require('../helper/jwt')

const router = express.Router()

// Validation schemas
const registerValidation = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})


// Register
// api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = registerValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const { username, email, password } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(409).json({
                error: existingUser.email === email ? 'Email already exists' : 'Username already exists'
            })
        }

        const user = new User({ username, email, password })
        await user.save()

        const { accessToken, refreshToken } = generateTokens(user._id)

        // Save session
        const session = new Session({
            userId: user._id,
            refreshToken,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        })
        await session.save()

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            tokens: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Login
// api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = loginValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const { email, password } = req.body

        const user = await User.findOne({ email, isActive: true })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const { accessToken, refreshToken } = generateTokens(user._id)

        // Save session
        const session = new Session({
            userId: user._id,
            refreshToken,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        })
        await session.save()

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            tokens: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Refresh token
// api/auth/refresh
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret')

        if (decoded.type !== 'refresh') {
            return res.status(401).json({ error: 'Invalid token type' })
        }

        const session = await Session.findOne({
            refreshToken,
            userId: decoded.userId,
            isActive: true,
            expiresAt: { $gt: new Date() }
        })

        if (!session) {
            return res.status(401).json({ error: 'Invalid refresh token' })
        }

        const user = await User.findById(decoded.userId)
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'User not found or inactive' })
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id)

        // Update session with new refresh token
        session.refreshToken = newRefreshToken
        await session.save()

        res.json({
            tokens: {
                accessToken,
                refreshToken: newRefreshToken
            }
        })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token expired' })
        }
        res.status(403).json({ error: 'Invalid refresh token' })
    }
})

// Logout
// api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (refreshToken) {
            await Session.findOneAndUpdate(
                { refreshToken, userId: req.user._id },
                { isActive: false }
            )
        }

        res.json({ message: 'Logged out successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get user profile
// api/auth/profile require auth
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.json({ user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Export both router and middleware
module.exports = router