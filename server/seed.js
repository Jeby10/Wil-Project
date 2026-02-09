const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import models
const { User } = require('./models/user')
const Pet = require('./models/pet')
const Application = require('./models/application')

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-adoption')
        console.log('✅ Connected to MongoDB')
    } catch (error) {
        console.error('❌ MongoDB connection error:', error)
        process.exit(1)
    }
}

// Clear existing data
const clearData = async () => {
    try {
        await User.deleteMany({})
        await Pet.deleteMany({})
        await Application.deleteMany({})
        console.log('🗑️  Cleared existing data')
    } catch (error) {
        console.error('❌ Error clearing data:', error)
        throw error
    }
}

// Seed Users
const seedUsers = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 12)

        const users = [
            {
                username: 'admin',
                email: 'admin@furetch.com',
                password: hashedPassword,
                role: 'admin',
                isActive: true
            },
            {
                username: 'john_doe',
                email: 'john.doe@example.com',
                password: hashedPassword,
                role: 'user',
                isActive: true
            },
            {
                username: 'jane_smith',
                email: 'jane.smith@example.com',
                password: hashedPassword,
                role: 'user',
                isActive: true
            },
            {
                username: 'pet_lover_42',
                email: 'petlover@example.com',
                password: hashedPassword,
                role: 'user',
                isActive: true
            }
        ]

        const createdUsers = await User.insertMany(users)
        console.log(`✅ Created ${createdUsers.length} users`)
        return createdUsers
    } catch (error) {
        console.error('❌ Error seeding users:', error)
        throw error
    }
}

// Seed Pets
const seedPets = async (adminUser) => {
    try {
        const pets = [
            // Dogs
            {
                name: 'Max',
                breed: 'Golden Retriever',
                age: 'Young',
                ageInMonths: 18,
                size: 'Large',
                petType: 'Dog',
                location: 'Austin, TX',
                description: 'Max is a friendly and energetic golden retriever who loves playing fetch and swimming. He is great with kids and other dogs. Already house-trained and knows basic commands.',
                emoji: '🐕',
                imageUrl: [
                    'https://images.dog.ceo/breeds/retriever-golden/n02099601_1003.jpg',
                    'https://images.dog.ceo/breeds/retriever-golden/n02099601_1389.jpg',
                    'https://images.dog.ceo/breeds/retriever-golden/n02099601_2209.jpg'
                ],
                urgent: false,
                healthStatus: 'Healthy, vaccinated, neutered',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Bella',
                breed: 'Labrador Retriever',
                age: 'Adult',
                ageInMonths: 48,
                size: 'Large',
                petType: 'Dog',
                location: 'San Francisco, CA',
                description: 'Sweet and gentle Bella loves long walks and cuddles. She is calm, well-mannered, and perfect for a family. Gets along well with children.',
                emoji: '🦮',
                imageUrl: [
                    'https://images.dog.ceo/breeds/labrador/n02099712_3503.jpg',
                    'https://images.dog.ceo/breeds/labrador/n02099712_5208.jpg',
                    'https://images.dog.ceo/breeds/labrador/n02099712_6950.jpg'
                ],
                urgent: true,
                healthStatus: 'Healthy, all vaccinations up to date',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Rocky',
                breed: 'German Shepherd',
                age: 'Young',
                ageInMonths: 24,
                size: 'Large',
                petType: 'Dog',
                location: 'Denver, CO',
                description: 'Rocky is a loyal and intelligent German Shepherd. He is protective yet gentle, making him an excellent family dog. Needs an active owner.',
                emoji: '🐕‍🦺',
                imageUrl: [
                    'https://images.dog.ceo/breeds/germanshepherd/n02106662_10399.jpg',
                    'https://images.dog.ceo/breeds/germanshepherd/n02106662_14437.jpg',
                    'https://images.dog.ceo/breeds/germanshepherd/n02106662_2486.jpg'
                ],
                urgent: false,
                healthStatus: 'Excellent health, neutered',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Daisy',
                breed: 'Beagle',
                age: 'Puppy/Kitten',
                ageInMonths: 8,
                size: 'Small',
                petType: 'Dog',
                location: 'Portland, OR',
                description: 'Adorable Daisy is a playful beagle puppy with boundless energy. She loves exploring and is very curious. Perfect for an active family.',
                emoji: '🐶',
                imageUrl: [
                    'https://images.dog.ceo/breeds/beagle/n02088364_10108.jpg',
                    'https://images.dog.ceo/breeds/beagle/n02088364_11140.jpg',
                    'https://images.dog.ceo/breeds/beagle/n02088364_6037.jpg'
                ],
                urgent: false,
                healthStatus: 'Healthy, first round of shots completed',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Duke',
                breed: 'Bulldog',
                age: 'Adult',
                ageInMonths: 60,
                size: 'Medium',
                petType: 'Dog',
                location: 'Chicago, IL',
                description: 'Duke is a laid-back bulldog who enjoys lounging around. He is great for apartment living and loves being around people. Very affectionate.',
                emoji: '🐕',
                imageUrl: [
                    'https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg',
                    'https://images.dog.ceo/breeds/bulldog-english/jager-2.jpg',
                    'https://images.dog.ceo/breeds/bulldog-french/n02108915_1226.jpg'
                ],
                urgent: false,
                healthStatus: 'Good health, minor skin allergies managed',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Charlie',
                breed: 'Mixed Breed',
                age: 'Senior',
                ageInMonths: 96,
                size: 'Medium',
                petType: 'Dog',
                location: 'Seattle, WA',
                description: 'Charlie is a sweet senior dog looking for a quiet home to spend his golden years. He is calm, gentle, and great with everyone.',
                emoji: '🐕',
                imageUrl: [
                    'https://images.dog.ceo/breeds/mix/n02115641-dingo-0196.jpg',
                    'https://images.dog.ceo/breeds/mix/n02115913-dhole-0116.jpg'
                ],
                urgent: true,
                healthStatus: 'Senior health check completed, arthritis medication',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Luna',
                breed: 'Husky',
                age: 'Young',
                ageInMonths: 20,
                size: 'Large',
                petType: 'Dog',
                location: 'Boston, MA',
                description: 'Luna is a beautiful and energetic husky with striking blue eyes. She needs lots of exercise and mental stimulation. Great for experienced dog owners.',
                emoji: '🐺',
                imageUrl: [
                    'https://images.dog.ceo/breeds/husky/n02110185_10047.jpg',
                    'https://images.dog.ceo/breeds/husky/n02110185_11261.jpg',
                    'https://images.dog.ceo/breeds/husky/n02110185_2654.jpg'
                ],
                urgent: false,
                healthStatus: 'Excellent health, spayed',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },

            // Cats
            {
                name: 'Whiskers',
                breed: 'Tabby Cat',
                age: 'Adult',
                ageInMonths: 36,
                size: 'Small',
                petType: 'Cat',
                location: 'New York, NY',
                description: 'Whiskers is an independent tabby who loves sunny windowsills. He is quiet, clean, and perfect for apartment living. Enjoys gentle pets.',
                emoji: '🐱',
                imageUrl: [
                    'https://cataas.com/cat?width=500&height=400&type=square&filter=1',
                    'https://cataas.com/cat?width=500&height=400&type=square&filter=2',
                    'https://cataas.com/cat?width=500&height=400&type=square&filter=3'
                ],
                urgent: false,
                healthStatus: 'Healthy, neutered, indoor cat',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Mittens',
                breed: 'Siamese',
                age: 'Young',
                ageInMonths: 16,
                size: 'Small',
                petType: 'Cat',
                location: 'Los Angeles, CA',
                description: 'Mittens is a vocal and affectionate Siamese cat. She loves attention and will follow you around the house. Very social and playful.',
                emoji: '😺',
                imageUrl: [
                    'https://cataas.com/cat/cute?width=500&height=400&type=square',
                    'https://cataas.com/cat/cute?width=500&height=400&type=md&blur=1',
                    'https://cataas.com/cat?width=500&height=400&brightness=50'
                ],
                urgent: false,
                healthStatus: 'Healthy, spayed, all vaccinations current',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Shadow',
                breed: 'Black Cat',
                age: 'Adult',
                ageInMonths: 42,
                size: 'Small',
                petType: 'Cat',
                location: 'Miami, FL',
                description: 'Shadow is a sleek black cat with a mysterious personality. He is independent but affectionate with his favorite people. Loves to play with feather toys.',
                emoji: '🐈‍⬛',
                imageUrl: [
                    'https://cataas.com/cat/black?width=500&height=400',
                    'https://cataas.com/cat?width=500&height=400&filter=noir',
                    'https://cataas.com/cat?width=500&height=400&saturation=-100'
                ],
                urgent: true,
                healthStatus: 'Good health, neutered',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Oliver',
                breed: 'Persian',
                age: 'Senior',
                ageInMonths: 108,
                size: 'Small',
                petType: 'Cat',
                location: 'Phoenix, AZ',
                description: 'Oliver is a dignified Persian cat seeking a calm and loving home. He requires regular grooming but is very gentle and sweet-natured.',
                emoji: '🐱',
                imageUrl: [
                    'https://cataas.com/cat?width=500&height=400&type=or',
                    'https://cataas.com/cat/fluffy?width=500&height=400',
                    'https://cataas.com/cat?width=500&height=400&filter=paint'
                ],
                urgent: false,
                healthStatus: 'Senior, requires daily grooming',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Cleo',
                breed: 'Calico',
                age: 'Young',
                ageInMonths: 14,
                size: 'Small',
                petType: 'Cat',
                location: 'Atlanta, GA',
                description: 'Cleo is a beautiful calico kitten with a playful personality. She loves chasing toys and climbing cat trees. Very friendly and curious.',
                emoji: '😸',
                imageUrl: [
                    'https://cataas.com/cat/cute?width=500&height=400&type=xs',
                    'https://cataas.com/cat?width=500&height=400&hue=45',
                    'https://cataas.com/cat/kitten?width=500&height=400'
                ],
                urgent: false,
                healthStatus: 'Healthy, spayed, kitten vaccinations complete',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Tigger',
                breed: 'Orange Tabby',
                age: 'Puppy/Kitten',
                ageInMonths: 6,
                size: 'Small',
                petType: 'Cat',
                location: 'Dallas, TX',
                description: 'Tigger is an adorable orange kitten full of energy and mischief. He loves to play and explore. Would do well with another young cat.',
                emoji: '🐈',
                imageUrl: [
                    'https://cataas.com/cat/orange?width=500&height=400',
                    'https://cataas.com/cat?width=500&height=400&hue=30',
                    'https://cataas.com/cat/cute?width=500&height=400&sepia=100'
                ],
                urgent: false,
                healthStatus: 'Healthy, first vaccinations completed',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Princess',
                breed: 'Ragdoll',
                age: 'Adult',
                ageInMonths: 40,
                size: 'Medium',
                petType: 'Cat',
                location: 'San Diego, CA',
                description: 'Princess is a gentle and laid-back ragdoll cat. She loves being held and goes limp like a ragdoll when picked up. Very docile and affectionate.',
                emoji: '😻',
                imageUrl: [
                    'https://cataas.com/cat?width=500&height=400&blur=0.5',
                    'https://cataas.com/cat/white?width=500&height=400',
                    'https://cataas.com/cat?width=500&height=400&brightness=120'
                ],
                urgent: false,
                healthStatus: 'Excellent health, spayed',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },

            // Other
            {
                name: 'Snowball',
                breed: 'Dwarf Rabbit',
                age: 'Young',
                ageInMonths: 12,
                size: 'Small',
                petType: 'Other',
                location: 'Minneapolis, MN',
                description: 'Snowball is a fluffy white rabbit who is litter-trained and very gentle. Perfect for families with children. Loves fresh vegetables.',
                emoji: '🐰',
                urgent: false,
                healthStatus: 'Healthy, neutered',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Hoppy',
                breed: 'Guinea Pig',
                age: 'Adult',
                ageInMonths: 24,
                size: 'Small',
                petType: 'Other',
                location: 'Orlando, FL',
                description: 'Hoppy is a friendly guinea pig who loves to squeak and run around. He is social and does well with other guinea pigs. Enjoys being held.',
                emoji: '🐹',
                urgent: true,
                healthStatus: 'Healthy, needs vitamin C supplements',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Tweety',
                breed: 'Parakeet',
                age: 'Young',
                ageInMonths: 8,
                size: 'Small',
                petType: 'Other',
                location: 'Nashville, TN',
                description: 'Tweety is a cheerful parakeet with beautiful blue and yellow feathers. He chirps melodiously and can learn to mimic sounds. Needs a spacious cage.',
                emoji: '🦜',
                urgent: false,
                healthStatus: 'Healthy, wings not clipped',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            },
            {
                name: 'Shelly',
                breed: 'Red-Eared Slider',
                age: 'Adult',
                ageInMonths: 60,
                size: 'Small',
                petType: 'Other',
                location: 'Tampa, FL',
                description: 'Shelly is a calm turtle who loves basking under her heat lamp. She is low-maintenance and fascinating to watch. Requires an aquatic setup.',
                emoji: '🐢',
                urgent: false,
                healthStatus: 'Healthy, shell in good condition',
                isAvailable: true,
                isActive: true,
                owner: adminUser._id
            }
        ]

        const createdPets = await Pet.insertMany(pets)
        console.log(`✅ Created ${createdPets.length} pets`)
        return createdPets
    } catch (error) {
        console.error('❌ Error seeding pets:', error)
        throw error
    }
}

// Seed Applications
const seedApplications = async (users, pets) => {
    try {
        const regularUsers = users.filter(u => u.role === 'user')

        const applications = [
            {
                applicantName: regularUsers[0].username,
                email: regularUsers[0].email,
                phone: '555-010-1001',
                petId: pets[0]._id,
                petName: pets[0].name,
                petType: pets[0].petType,
                address: '123 Main St, Austin, TX 78701',
                experience: 'I have had dogs for over 10 years and currently have a fenced backyard.',
                reason: 'I am looking for a companion for my morning runs and family activities. Max seems like the perfect fit for our active lifestyle.',
                status: 'approved',
                notes: 'Great applicant with experience. Home visit completed successfully.',
                applicantId: regularUsers[0]._id,
                submittedDate: new Date('2026-01-15'),
                lastUpdated: new Date('2026-01-20')
            },
            {
                applicantName: regularUsers[1].username,
                email: regularUsers[1].email,
                phone: '555-010-1002',
                petId: pets[1]._id,
                petName: pets[1].name,
                petType: pets[1].petType,
                address: '456 Oak Ave, San Francisco, CA 94102',
                experience: 'First-time dog owner but have researched extensively and taken training classes.',
                reason: 'I work from home and have always wanted a dog. Bella seems calm and would be perfect for my lifestyle.',
                status: 'pending',
                notes: '',
                applicantId: regularUsers[1]._id,
                submittedDate: new Date('2026-02-01'),
                lastUpdated: new Date('2026-02-01')
            },
            {
                applicantName: regularUsers[2].username,
                email: regularUsers[2].email,
                phone: '555-010-1003',
                petId: pets[7]._id,
                petName: pets[7].name,
                petType: pets[7].petType,
                address: '789 Pine St, New York, NY 10001',
                experience: 'Lifelong cat owner, currently have no pets after my previous cat passed away.',
                reason: 'Looking for a quiet companion for my apartment. Whiskers sounds perfect for my lifestyle.',
                status: 'approved',
                notes: 'Excellent references from previous vet. Approved for adoption.',
                applicantId: regularUsers[2]._id,
                submittedDate: new Date('2026-01-25'),
                lastUpdated: new Date('2026-01-28')
            },
            {
                applicantName: regularUsers[0].username,
                email: regularUsers[0].email,
                phone: '555-010-1001',
                petId: pets[5]._id,
                petName: pets[5].name,
                petType: pets[5].petType,
                address: '123 Main St, Austin, TX 78701',
                experience: 'Experienced with senior dogs. Previously cared for an elderly labrador.',
                reason: 'Want to give Charlie a loving home for his golden years. Have experience with senior dog care and medication management.',
                status: 'pending',
                notes: '',
                applicantId: regularUsers[0]._id,
                submittedDate: new Date('2026-02-03'),
                lastUpdated: new Date('2026-02-03')
            },
            {
                applicantName: regularUsers[1].username,
                email: regularUsers[1].email,
                phone: '555-010-1002',
                petId: pets[9]._id,
                petName: pets[9].name,
                petType: pets[9].petType,
                address: '456 Oak Ave, San Francisco, CA 94102',
                experience: 'No prior cat experience.',
                reason: 'Saw Shadow online and fell in love. Want to adopt my first cat.',
                status: 'rejected',
                notes: 'Applicant works long hours and travels frequently. Not suitable for this pet at this time.',
                applicantId: regularUsers[1]._id,
                submittedDate: new Date('2026-01-18'),
                lastUpdated: new Date('2026-01-22')
            },
            {
                applicantName: regularUsers[2].username,
                email: regularUsers[2].email,
                phone: '555-010-1003',
                petId: pets[11]._id,
                petName: pets[11].name,
                petType: pets[11].petType,
                address: '789 Pine St, New York, NY 10001',
                experience: 'Have two other cats at home, both friendly and social.',
                reason: 'Looking to add a kitten to our family. Cleo would be a great addition and my cats love playing with younger cats.',
                status: 'pending',
                notes: '',
                applicantId: regularUsers[2]._id,
                submittedDate: new Date('2026-02-04'),
                lastUpdated: new Date('2026-02-04')
            },
            {
                applicantName: regularUsers[0].username,
                email: regularUsers[0].email,
                phone: '555-010-1001',
                petId: pets[15]._id,
                petName: pets[15].name,
                petType: pets[15].petType,
                address: '123 Main St, Austin, TX 78701',
                experience: 'Had rabbits as a child and know their care requirements.',
                reason: 'My kids have been asking for a pet and Snowball seems like a great family-friendly option.',
                status: 'approved',
                notes: 'Family has appropriate setup and knowledge. Approved.',
                applicantId: regularUsers[0]._id,
                submittedDate: new Date('2026-01-28'),
                lastUpdated: new Date('2026-01-30')
            },
            {
                applicantName: regularUsers[2].username,
                email: regularUsers[2].email,
                phone: '555-010-1003',
                petId: pets[3]._id,
                petName: pets[3].name,
                petType: pets[3].petType,
                address: '789 Pine St, New York, NY 10001',
                experience: 'No dog experience but willing to learn and take training classes.',
                reason: 'Daisy is adorable and I have flexible work schedule to care for a puppy. Ready for the commitment.',
                status: 'pending',
                notes: '',
                applicantId: regularUsers[2]._id,
                submittedDate: new Date('2026-02-05'),
                lastUpdated: new Date('2026-02-05')
            }
        ]

        const createdApplications = await Application.insertMany(applications)
        console.log(`✅ Created ${createdApplications.length} applications`)
        return createdApplications
    } catch (error) {
        console.error('❌ Error seeding applications:', error)
        throw error
    }
}

// Main seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n')

        await connectDB()
        await clearData()

        const users = await seedUsers()
        const adminUser = users.find(u => u.role === 'admin')

        const pets = await seedPets(adminUser)
        await seedApplications(users, pets)

        console.log('\n✅ Database seeding completed successfully!')
        console.log('\n📊 Summary:')
        console.log(`   Users: ${users.length}`)
        console.log(`   Pets: ${pets.length}`)
        console.log(`   Applications: 8`)
        console.log('\n🔐 Admin Credentials:')
        console.log('   Email: admin@furetch.com')
        console.log('   Password: password123')
        console.log('\n👤 User Credentials (all have password: password123):')
        console.log('   - john.doe@example.com')
        console.log('   - jane.smith@example.com')
        console.log('   - petlover@example.com')

        process.exit(0)
    } catch (error) {
        console.error('❌ Database seeding failed:', error)
        process.exit(1)
    }
}

// Run the seed function
seedDatabase()
