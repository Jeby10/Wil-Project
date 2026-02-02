/**
 * CONTROLLER - Logic Layer
 * Handles user interactions and coordinates between Model and View
 * Follows MVC architectural pattern
 */

class AdoptionApplicationController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Bind event listeners
        this.bindEvents();

        // Initial render
        this.updateDisplay();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Form submission
        this.view.applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmitApplication();
        });

        // Edit form submission
        this.view.editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUpdateApplication();
        });

        // Filter change
        this.view.statusFilter.addEventListener('change', () => {
            this.handleFilterChange();
        });
    }

    /**
     * Handle new application submission
     */
    handleSubmitApplication() {
        const formData = this.view.getFormData();

        // Validate data
        const validation = this.model.validateApplication(formData);
        
        if (!validation.isValid) {
            this.view.showValidationErrors(validation.errors);
            return;
        }

        // Create application
        try {
            const newApplication = this.model.createApplication(formData);
            
            // Update display
            this.updateDisplay();
            
            // Reset form
            this.view.resetForm();
            
            // Show success message
            this.view.showSuccessMessage(`Application submitted successfully for ${newApplication.applicantName}!`);
            
            // Highlight new application
            this.view.highlightNewApplication(newApplication.id);
            
        } catch (error) {
            console.error('Error submitting application:', error);
            this.view.showErrorMessage('An error occurred while submitting the application. Please try again.');
        }
    }

    /**
     * Handle application status update
     */
    handleUpdateApplication() {
        const editData = this.view.getEditFormData();

        try {
            const updatedApp = this.model.updateApplication(
                editData.id,
                editData.status,
                editData.notes
            );

            if (updatedApp) {
                // Close modal
                this.view.closeModal();
                
                // Update display
                this.updateDisplay();
                
                // Show success message
                this.view.showSuccessMessage(`Application status updated to ${editData.status}!`);
            } else {
                this.view.showErrorMessage('Application not found.');
            }
        } catch (error) {
            console.error('Error updating application:', error);
            this.view.showErrorMessage('An error occurred while updating the application.');
        }
    }

    /**
     * Handle delete application
     * @param {number} id - Application ID to delete
     */
    deleteApplication(id) {
        const application = this.model.getApplicationById(id);
        
        if (!application) {
            this.view.showErrorMessage('Application not found.');
            return;
        }

        // Confirm deletion
        if (!this.view.confirmDelete(application.applicantName)) {
            return;
        }

        try {
            const success = this.model.deleteApplication(id);
            
            if (success) {
                // Update display
                this.updateDisplay();
                
                // Show success message
                this.view.showSuccessMessage('Application deleted successfully.');
            } else {
                this.view.showErrorMessage('Failed to delete application.');
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            this.view.showErrorMessage('An error occurred while deleting the application.');
        }
    }

    /**
     * Handle filter change
     */
    handleFilterChange() {
        this.updateDisplay();
    }

    /**
     * Open edit modal for an application
     * @param {number} id - Application ID
     */
    openEditModal(id) {
        const application = this.model.getApplicationById(id);
        
        if (application) {
            this.view.openEditModal(application);
        } else {
            this.view.showErrorMessage('Application not found.');
        }
    }

    /**
     * Update the entire display (applications and statistics)
     */
    updateDisplay() {
        // Get current filter
        const filterStatus = this.view.getCurrentFilter();
        
        // Get filtered applications
        const applications = this.model.getApplicationsByStatus(filterStatus);
        
        // Render applications
        this.view.renderApplications(applications);
        
        // Update statistics
        const stats = this.model.getStatistics();
        this.view.updateStatistics(stats);
    }

    /**
     * Get all applications (for debugging)
     * @returns {Array} All applications
     */
    getAllApplications() {
        return this.model.getAllApplications();
    }

    /**
     * Clear all applications (for testing)
     */
    clearAll() {
        if (confirm('Are you sure you want to delete ALL applications? This cannot be undone.')) {
            this.model.clearAllApplications();
            this.updateDisplay();
            this.view.showSuccessMessage('All applications cleared.');
        }
    }

    /**
     * Get statistics (for debugging)
     * @returns {Object} Statistics
     */
    getStatistics() {
        return this.model.getStatistics();
    }
}