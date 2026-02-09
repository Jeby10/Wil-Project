const express = require('express')
const Joi = require('joi')
const Application = require('../models/application')
const Pet = require('../models/pet')
const { authenticateToken, isAdmin } = require('../middleware/auth')

const router = express.Router()

// Validation schema
const createApplicationValidation = Joi.object({
    applicantName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).required(),
    petId: Joi.string().required(),
    petName: Joi.string().min(2).required(),
    petType: Joi.string().valid('Dog', 'Cat', 'Other').required(),
    address: Joi.string().min(5).max(200).required(),
    experience: Joi.string().max(500).optional().allow(''),
    reason: Joi.string().min(10).max(500).required()
})

const updateApplicationValidation = Joi.object({
    status: Joi.string().valid('pending', 'approved', 'rejected').required(),
    notes: Joi.string().max(1000).optional().allow('')
})

// Submit new application (authenticated)
// POST /api/applications
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { error } = createApplicationValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const { petId } = req.body

        // Check if pet exists and is available
        const pet = await Pet.findOne({ _id: petId, isActive: true, isAvailable: true })
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found or not available for adoption' })
        }

        // Check if user already has a pending application for this pet
        const existingApplication = await Application.findOne({
            applicantId: req.user._id,
            petId: petId,
            status: 'pending'
        })

        if (existingApplication) {
            return res.status(400).json({ error: 'You already have a pending application for this pet' })
        }

        const applicationData = {
            ...req.body,
            applicantId: req.user._id
        }

        const application = new Application(applicationData)
        await application.save()

        res.status(201).json({
            message: 'Application submitted successfully',
            application
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get user's applications (authenticated)
// GET /api/applications
router.get('/', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.find({
            applicantId: req.user._id
        })
            .populate('petId', 'name breed age size location emoji imageUrl')
            .sort({ submittedDate: -1 })

        res.json({
            count: applications.length,
            applications
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get all applications (admin only)
// GET /api/applications/admin/all?status=pending
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.query

        const filter = {}
        if (status && status !== 'all') {
            filter.status = status
        }

        const applications = await Application.find(filter)
            .populate('petId', 'name breed age size location emoji imageUrl')
            .populate('applicantId', 'username email')
            .sort({ submittedDate: -1 })

        res.json({
            count: applications.length,
            applications
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get application statistics (admin only)
// GET /api/applications/admin/stats
router.get('/admin/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const total = await Application.countDocuments()
        const pending = await Application.countDocuments({ status: 'pending' })
        const approved = await Application.countDocuments({ status: 'approved' })
        const rejected = await Application.countDocuments({ status: 'rejected' })

        res.json({
            total,
            pending,
            approved,
            rejected
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get single application (owner or admin)
// GET /api/applications/:id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('petId', 'name breed age size location emoji imageUrl')
            .populate('applicantId', 'username email')

        if (!application) {
            return res.status(404).json({ error: 'Application not found' })
        }

        // Check if user is owner or admin
        if (application.applicantId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' })
        }

        res.json({ application })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update application status (admin only)
// PUT /api/applications/:id
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { error } = updateApplicationValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: req.body.status,
                    notes: req.body.notes || '',
                    lastUpdated: new Date()
                }
            },
            { new: true, runValidators: true }
        )
            .populate('petId', 'name breed age size location emoji imageUrl')
            .populate('applicantId', 'username email')

        if (!application) {
            return res.status(404).json({ error: 'Application not found' })
        }

        res.json({
            message: 'Application updated successfully',
            application
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Delete application (admin only)
// DELETE /api/applications/:id
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id)

        if (!application) {
            return res.status(404).json({ error: 'Application not found' })
        }

        res.json({
            message: 'Application deleted successfully'
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
