const express = require('express')
const Joi = require('joi')

const { authenticateToken } = require('../middleware/auth')
const { User, Session } = require('../models/user')

const router = express.Router()

const updateUserValidation = Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional()
})

const updatePasswordValidation = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
        .messages({ 'any.only': 'Passwords do not match' })
})

// api/user/profile update 
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { error } = updateUserValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const { username, email } = req.body
        const updates = {}

        // Only add fields that are provided
        if (username) updates.username = username
        if (email) updates.email = email

        // Check if username or email already exists (excluding current user)
        if (username || email) {
            const existingUser = await User.findOne({
                _id: { $ne: req.user._id },
                $or: [
                    ...(username ? [{ username }] : []),
                    ...(email ? [{ email }] : [])
                ]
            })

            if (existingUser) {
                if (existingUser.username === username) {
                    return res.status(409).json({ error: 'Username already exists' })
                }
                if (existingUser.email === email) {
                    return res.status(409).json({ error: 'Email already exists' })
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Validate password

// api/user/password update 
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const { error } = updatePasswordValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const { currentPassword, newPassword } = req.body

        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword)
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ error: 'Current password is incorrect' })
        }

        // Check if new password is same as current password
        const isSamePassword = await user.comparePassword(newPassword)
        if (isSamePassword) {
            return res.status(400).json({ error: 'New password must be different from current password' })
        }

        // Update password
        user.password = newPassword
        await user.save()

        // Invalidate all existing sessions for security
        await Session.updateMany(
            { userId: req.user._id },
            { isActive: false }
        )

        res.json({
            message: 'Password updated successfully. Please log in again with your new password.'
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Export both router and middleware
module.exports = router