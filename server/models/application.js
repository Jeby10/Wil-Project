const mongoose = require('mongoose')

// Adoption Application Schema
const applicationSchema = new mongoose.Schema({
    applicantName: {
        type: String,
        required: [true, 'Applicant name is required'],
        trim: true,
        minlength: [2, 'Applicant name must be at least 2 characters'],
        maxlength: [100, 'Applicant name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        minlength: [10, 'Phone number must be at least 10 characters']
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: [true, 'Pet reference is required']
    },
    petName: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true
    },
    petType: {
        type: String,
        required: [true, 'Pet type is required'],
        enum: {
            values: ['Dog', 'Cat', 'Other'],
            message: '{VALUE} is not a valid pet type'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [5, 'Address must be at least 5 characters'],
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    experience: {
        type: String,
        trim: true,
        maxlength: [500, 'Experience cannot exceed 500 characters']
    },
    reason: {
        type: String,
        required: [true, 'Reason for adoption is required'],
        trim: true,
        minlength: [10, 'Reason must be at least 10 characters'],
        maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'approved', 'rejected'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        default: ''
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Applicant user reference is required']
    },
    submittedDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Update lastUpdated on save
applicationSchema.pre('save', function(next) {
    this.lastUpdated = new Date()
    next()
})

// Indexes for efficient querying
applicationSchema.index({ applicantId: 1 })
applicationSchema.index({ petId: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ submittedDate: -1 })

// Model
const Application = mongoose.model('Application', applicationSchema)

module.exports = Application
