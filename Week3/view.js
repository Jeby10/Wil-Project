/**
 * VIEW - Presentation Layer
 * Handles all DOM manipulation and user interface updates
 * Follows MVC architectural pattern
 */

class AdoptionApplicationView {
    constructor() {
        // Cache DOM elements
        this.applicationsList = document.getElementById('applicationsList');
        this.applicationForm = document.getElementById('applicationForm');
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.statusFilter = document.getElementById('statusFilter');
        
        // Statistics elements
        this.totalApps = document.getElementById('totalApps');
        this.pendingApps = document.getElementById('pendingApps');
        this.approvedApps = document.getElementById('approvedApps');
        this.rejectedApps = document.getElementById('rejectedApps');

        // Setup modal close button
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeModal();
        }

        // Close modal when clicking outside
        window.onclick = (event) => {
            if (event.target === this.editModal) {
                this.closeModal();
            }
        };
    }

    /**
     * Render all applications to the DOM
     * @param {Array} applications - Applications to display
     */
    renderApplications(applications) {
        if (applications.length === 0) {
            this.applicationsList.innerHTML = `
                <div class="empty-state">
                    <p>No applications found. Try adjusting your filters or submit a new application!</p>
                </div>
            `;
            return;
        }

        this.applicationsList.innerHTML = applications.map(app => 
            this.createApplicationCard(app)
        ).join('');
    }

    /**
     * Create HTML for a single application card
     * @param {Object} app - Application data
     * @returns {string} HTML string
     */
    createApplicationCard(app) {
        const submittedDate = new Date(app.submittedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const lastUpdated = new Date(app.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="application-card ${app.status}" data-id="${app.id}">
                <div class="card-header">
                    <div class="card-title">
                        <h3>${this.escapeHtml(app.applicantName)}</h3>
                        <div class="pet-info">🐾 ${this.escapeHtml(app.petName)} (${this.escapeHtml(app.petType)})</div>
                    </div>
                    <span class="status-badge ${app.status}">${app.status}</span>
                </div>

                <div class="card-body">
                    <div class="info-item">
                        <span class="info-label">📧 Email</span>
                        <span class="info-value">${this.escapeHtml(app.email)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📱 Phone</span>
                        <span class="info-value">${this.escapeHtml(app.phone)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📍 Address</span>
                        <span class="info-value">${this.escapeHtml(app.address)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📅 Submitted</span>
                        <span class="info-value">${submittedDate}</span>
                    </div>
                </div>

                <div class="card-details">
                    <h4>Previous Experience:</h4>
                    <p>${this.escapeHtml(app.experience)}</p>
                </div>

                <div class="card-details">
                    <h4>Reason for Adoption:</h4>
                    <p>${this.escapeHtml(app.reason)}</p>
                </div>

                ${app.notes ? `
                    <div class="card-details">
                        <h4>Admin Notes:</h4>
                        <p>${this.escapeHtml(app.notes)}</p>
                    </div>
                ` : ''}

                <div class="card-footer">
                    <button class="btn btn-warning" onclick="controller.openEditModal(${app.id})">
                        ✏️ Edit Status
                    </button>
                    <button class="btn btn-danger" onclick="controller.deleteApplication(${app.id})">
                        🗑️ Delete
                    </button>
                </div>

                <div class="card-meta">
                    Last updated: ${lastUpdated}
                </div>
            </div>
        `;
    }

    /**
     * Update statistics display
     * @param {Object} stats - Statistics object
     */
    updateStatistics(stats) {
        this.totalApps.textContent = stats.total;
        this.pendingApps.textContent = stats.pending;
        this.approvedApps.textContent = stats.approved;
        this.rejectedApps.textContent = stats.rejected;
    }

    /**
     * Get form data from submission form
     * @returns {Object} Form data
     */
    getFormData() {
        return {
            applicantName: document.getElementById('applicantName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            petName: document.getElementById('petName').value.trim(),
            petType: document.getElementById('petType').value,
            address: document.getElementById('address').value.trim(),
            experience: document.getElementById('experience').value.trim(),
            reason: document.getElementById('reason').value.trim()
        };
    }

    /**
     * Reset the submission form
     */
    resetForm() {
        this.applicationForm.reset();
    }

    /**
     * Open edit modal with application data
     * @param {Object} application - Application to edit
     */
    openEditModal(application) {
        document.getElementById('editId').value = application.id;
        document.getElementById('editStatus').value = application.status;
        document.getElementById('editNotes').value = application.notes || '';
        this.editModal.style.display = 'block';
    }

    /**
     * Close edit modal
     */
    closeModal() {
        this.editModal.style.display = 'none';
        this.editForm.reset();
    }

    /**
     * Get edit form data
     * @returns {Object} Edit form data
     */
    getEditFormData() {
        return {
            id: parseInt(document.getElementById('editId').value, 10),
            status: document.getElementById('editStatus').value,
            notes: document.getElementById('editNotes').value.trim()
        };
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        
        this.applicationsList.parentNode.insertBefore(messageDiv, this.applicationsList);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'error-message';
        messageDiv.textContent = message;
        
        this.applicationsList.parentNode.insertBefore(messageDiv, this.applicationsList);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }

    /**
     * Show validation errors
     * @param {Array} errors - Array of error messages
     */
    showValidationErrors(errors) {
        const errorMessage = 'Please fix the following errors:\n\n' + errors.join('\n');
        alert(errorMessage);
    }

    /**
     * Confirm deletion
     * @param {string} applicantName - Name of applicant
     * @returns {boolean} User confirmation
     */
    confirmDelete(applicantName) {
        return confirm(`Are you sure you want to delete the application from ${applicantName}? This action cannot be undone.`);
    }

    /**
     * Scroll to top of page smoothly
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get current filter value
     * @returns {string} Current filter status
     */
    getCurrentFilter() {
        return this.statusFilter.value;
    }

    /**
     * Highlight a newly added application
     * @param {number} applicationId - ID of the application
     */
    highlightNewApplication(applicationId) {
        setTimeout(() => {
            const card = document.querySelector(`[data-id="${applicationId}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.style.backgroundColor = '#fff3cd';
                setTimeout(() => {
                    card.style.backgroundColor = '';
                }, 2000);
            }
        }, 100);
    }
}

// Make closeEditModal available globally for the modal close button
function closeEditModal() {
    if (window.view) {
        window.view.closeModal();
    }
}