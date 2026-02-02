/**
 * MODEL - Data Layer
 * Handles all data operations and business logic
 * Follows MVC architectural pattern
 */

class AdoptionApplicationModel {
    constructor() {
        this.applications = [];
        this.nextId = 1;
        this.loadFromStorage();
    }

    /**
     * Create a new adoption application
     * @param {Object} applicationData - Application details
     * @returns {Object} Created application
     */
    createApplication(applicationData) {
        const newApplication = {
            id: this.nextId++,
            applicantName: applicationData.applicantName,
            email: applicationData.email,
            phone: applicationData.phone,
            petName: applicationData.petName,
            petType: applicationData.petType,
            address: applicationData.address,
            experience: applicationData.experience || 'Not provided',
            reason: applicationData.reason,
            status: 'pending', // pending, approved, rejected
            notes: '',
            submittedDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        this.applications.push(newApplication);
        this.saveToStorage();
        return newApplication;
    }

    /**
     * Get all applications
     * @returns {Array} All applications
     */
    getAllApplications() {
        return [...this.applications];
    }

    /**
     * Get application by ID
     * @param {number} id - Application ID
     * @returns {Object|null} Application or null if not found
     */
    getApplicationById(id) {
        return this.applications.find(app => app.id === id) || null;
    }

    /**
     * Get applications by status
     * @param {string} status - Status filter (pending, approved, rejected)
     * @returns {Array} Filtered applications
     */
    getApplicationsByStatus(status) {
        if (status === 'all') {
            return this.getAllApplications();
        }
        return this.applications.filter(app => app.status === status);
    }

    /**
     * Update application status and notes
     * @param {number} id - Application ID
     * @param {string} status - New status
     * @param {string} notes - Admin notes
     * @returns {Object|null} Updated application or null
     */
    updateApplication(id, status, notes) {
        const application = this.getApplicationById(id);
        if (!application) {
            return null;
        }

        application.status = status;
        application.notes = notes || application.notes;
        application.lastUpdated = new Date().toISOString();

        this.saveToStorage();
        return application;
    }

    /**
     * Delete an application
     * @param {number} id - Application ID
     * @returns {boolean} Success status
     */
    deleteApplication(id) {
        const index = this.applications.findIndex(app => app.id === id);
        if (index === -1) {
            return false;
        }

        this.applications.splice(index, 1);
        this.saveToStorage();
        return true;
    }

    /**
     * Get statistics about applications
     * @returns {Object} Statistics
     */
    getStatistics() {
        const total = this.applications.length;
        const pending = this.applications.filter(app => app.status === 'pending').length;
        const approved = this.applications.filter(app => app.status === 'approved').length;
        const rejected = this.applications.filter(app => app.status === 'rejected').length;

        return {
            total,
            pending,
            approved,
            rejected
        };
    }

    /**
     * Validate application data
     * @param {Object} data - Application data to validate
     * @returns {Object} Validation result
     */
    validateApplication(data) {
        const errors = [];

        if (!data.applicantName || data.applicantName.trim().length < 2) {
            errors.push('Applicant name must be at least 2 characters');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Valid email address is required');
        }

        if (!data.phone || data.phone.trim().length < 10) {
            errors.push('Valid phone number is required');
        }

        if (!data.petName || data.petName.trim().length < 2) {
            errors.push('Pet name must be at least 2 characters');
        }

        if (!data.petType) {
            errors.push('Pet type is required');
        }

        if (!data.address || data.address.trim().length < 5) {
            errors.push('Valid address is required');
        }

        if (!data.reason || data.reason.trim().length < 10) {
            errors.push('Reason for adoption must be at least 10 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Save applications to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('adoptionApplications', JSON.stringify(this.applications));
            localStorage.setItem('nextId', this.nextId.toString());
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Load applications from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('adoptionApplications');
            const storedId = localStorage.getItem('nextId');

            if (stored) {
                this.applications = JSON.parse(stored);
            }

            if (storedId) {
                this.nextId = parseInt(storedId, 10);
            }

            // Add sample data if empty
            if (this.applications.length === 0) {
                this.addSampleData();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.addSampleData();
        }
    }

    /**
     * Add sample applications for demo purposes
     */
    addSampleData() {
        const sampleApplications = [
            {
                applicantName: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                phone: '(416) 555-0101',
                petName: 'Max',
                petType: 'Dog',
                address: '123 King St, Toronto, ON',
                experience: 'I grew up with dogs and have owned two golden retrievers in the past.',
                reason: 'I recently moved to a larger apartment and am ready to provide a loving home to a dog in need.'
            },
            {
                applicantName: 'Michael Chen',
                email: 'mchen@example.com',
                phone: '(647) 555-0202',
                petName: 'Luna',
                petType: 'Cat',
                address: '456 Queen St W, Toronto, ON',
                experience: 'First-time cat owner but have researched extensively and prepared my home.',
                reason: 'I work from home and want a companion. Luna seems perfect for my lifestyle.'
            },
            {
                applicantName: 'Emily Rodriguez',
                email: 'emily.r@example.com',
                phone: '(905) 555-0303',
                petName: 'Charlie',
                petType: 'Dog',
                address: '789 Yonge St, Toronto, ON',
                experience: 'Volunteered at animal shelter for 3 years. Currently have one rescue dog.',
                reason: 'Looking to adopt another dog as a companion for my current pet and to help another animal.'
            }
        ];

        sampleApplications.forEach(app => this.createApplication(app));
        
        // Update first application to approved status
        this.updateApplication(1, 'approved', 'Great application! Home visit completed successfully.');
    }

    /**
     * Clear all applications (for testing)
     */
    clearAllApplications() {
        this.applications = [];
        this.nextId = 1;
        this.saveToStorage();
    }

    /**
     * Search applications by applicant name or pet name
     * @param {string} query - Search query
     * @returns {Array} Matching applications
     */
    searchApplications(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.applications.filter(app => 
            app.applicantName.toLowerCase().includes(lowercaseQuery) ||
            app.petName.toLowerCase().includes(lowercaseQuery) ||
            app.email.toLowerCase().includes(lowercaseQuery)
        );
    }
}