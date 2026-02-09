const mongoose = require('mongoose')

// Pet Schema
const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true,
        maxlength: [50, 'Pet name cannot exceed 50 characters']
    },
    breed: {
        type: String,
        required: [true, 'Breed is required'],
        trim: true,
        maxlength: [50, 'Breed cannot exceed 50 characters']
    },
    age: {
        type: String,
        enum: {
            values: ['Puppy/Kitten', 'Young', 'Adult', 'Senior'],
            message: '{VALUE} is not a valid age category'
        },
        required: [true, 'Age category is required']
    },
    ageInMonths: {
        type: Number,
        min: [0, 'Age in months cannot be negative'],
        max: [300, 'Age in months seems too high']
    },
    size: {
        type: String,
        enum: {
            values: ['Small', 'Medium', 'Large'],
            message: '{VALUE} is not a valid size'
        },
        required: [true, 'Size is required']
    },
    petType: {
        type: String,
        enum: {
            values: ['Dog', 'Cat', 'Other'],
            message: '{VALUE} is not a valid pet type'
        },
        required: [true, 'Pet type is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    emoji: {
        type: String,
        default: '🐾'
    },
    imageUrl: {
        type: [String],
        default: []
    },
    urgent: {
        type: Boolean,
        default: false
    },
    healthStatus: {
        type: String,
        trim: true,
        maxlength: [200, 'Health status cannot exceed 200 characters']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

// Indexes for efficient querying
petSchema.index({ petType: 1 })
petSchema.index({ isAvailable: 1 })
petSchema.index({ isActive: 1 })
petSchema.index({ location: 'text', breed: 'text', name: 'text' })

// Model
const Pet = mongoose.model('Pet', petSchema)

module.exports = Pet
