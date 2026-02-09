const express = require('express')
const Joi = require('joi')
const Pet = require('../models/pet')
const { authenticateToken, isAdmin } = require('../middleware/auth')

const router = express.Router()

// Validation schemas
const createPetValidation = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    breed: Joi.string().min(2).max(50).required(),
    age: Joi.string().valid('Puppy/Kitten', 'Young', 'Adult', 'Senior').required(),
    ageInMonths: Joi.number().min(0).max(300).optional(),
    size: Joi.string().valid('Small', 'Medium', 'Large').required(),
    petType: Joi.string().valid('Dog', 'Cat', 'Other').required(),
    location: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(1000).optional().allow(''),
    emoji: Joi.string().optional(),
    imageUrl: Joi.array().items(Joi.string().uri()).optional(),
    urgent: Joi.boolean().optional(),
    healthStatus: Joi.string().max(200).optional().allow('')
})

const updatePetValidation = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    breed: Joi.string().min(2).max(50).optional(),
    age: Joi.string().valid('Puppy/Kitten', 'Young', 'Adult', 'Senior').optional(),
    ageInMonths: Joi.number().min(0).max(300).optional(),
    size: Joi.string().valid('Small', 'Medium', 'Large').optional(),
    petType: Joi.string().valid('Dog', 'Cat', 'Other').optional(),
    location: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(1000).optional().allow(''),
    emoji: Joi.string().optional(),
    imageUrl: Joi.array().items(Joi.string().uri()).optional(),
    urgent: Joi.boolean().optional(),
    healthStatus: Joi.string().max(200).optional().allow(''),
    isAvailable: Joi.boolean().optional()
})

// Get all pets (public with filters)
// GET /api/pets?petType=Dog&size=Large&breed=Labrador&location=Toronto&urgent=true
router.get('/', async (req, res) => {
    try {
        const { petType, size, breed, age, location, urgent } = req.query

        // Build filter query
        const filter = { isActive: true, isAvailable: true }

        if (petType) filter.petType = petType
        if (size) filter.size = size
        if (breed) filter.breed = new RegExp(breed, 'i') // Case-insensitive
        if (age) filter.age = age
        if (location) filter.location = new RegExp(location, 'i') // Case-insensitive
        if (urgent !== undefined) filter.urgent = urgent === 'true'

        const pets = await Pet.find(filter)
            .select('-__v')
            .populate('owner', 'username email')
            .sort({ urgent: -1, createdAt: -1 })

        res.json({
            count: pets.length,
            pets
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get single pet (public)
// GET /api/pets/:id
router.get('/:id', async (req, res) => {
    try {
        const pet = await Pet.findOne({
            _id: req.params.id,
            isActive: true
        })
            .select('-__v')
            .populate('owner', 'username email')

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' })
        }

        res.json({ pet })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Create new pet (admin only)
// POST /api/pets
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { error } = createPetValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const petData = {
            ...req.body,
            owner: req.user._id
        }

        const pet = new Pet(petData)
        await pet.save()

        res.status(201).json({
            message: 'Pet created successfully',
            pet
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update pet (admin only)
// PUT /api/pets/:id
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { error } = updatePetValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const pet = await Pet.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            { $set: req.body },
            { new: true, runValidators: true }
        )

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' })
        }

        res.json({
            message: 'Pet updated successfully',
            pet
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Soft delete pet (admin only)
// DELETE /api/pets/:id
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const pet = await Pet.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            { $set: { isActive: false, isAvailable: false } },
            { new: true }
        )

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' })
        }

        res.json({
            message: 'Pet deleted successfully',
            pet
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
