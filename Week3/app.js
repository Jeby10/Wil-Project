/**
 * APPLICATION INITIALIZATION
 * Entry point for the MVC Adoption Application Tracker
 * Initializes Model, View, and Controller
 */

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐾 Fur Fetch Adoption Tracker - Initializing...');

    // Create instances of Model, View, and Controller
    const model = new AdoptionApplicationModel();
    const view = new AdoptionApplicationView();
    const controller = new AdoptionApplicationController(model, view);

    // Make controller available globally for inline event handlers
    window.controller = controller;
    window.view = view;
    window.model = model;

    console.log('✅ MVC Application initialized successfully!');
    console.log('📊 Model:', model);
    console.log('👁️ View:', view);
    console.log('🎮 Controller:', controller);

    // Display welcome message in console
    console.log('%c🐾 Fur Fetch Adoption Tracker', 'font-size: 20px; font-weight: bold; color: #667eea;');
    console.log('%cMVC Architecture Pattern', 'font-size: 14px; color: #764ba2;');
    console.log('%c─────────────────────────────', 'color: #cccccc;');
    console.log('📦 Model: Data management and business logic');
    console.log('👁️ View: User interface and DOM manipulation');
    console.log('🎮 Controller: Event handling and coordination');
    console.log('%c─────────────────────────────', 'color: #cccccc;');
    console.log('%cAvailable Commands:', 'font-weight: bold; color: #28a745;');
    console.log('• controller.getAllApplications() - View all applications');
    console.log('• controller.getStatistics() - Get statistics');
    console.log('• controller.clearAll() - Clear all applications');
    console.log('• model.searchApplications("query") - Search applications');

    // Log initial statistics
    const stats = controller.getStatistics();
    console.log('%cInitial Statistics:', 'font-weight: bold; color: #ffc107;');
    console.log(`Total Applications: ${stats.total}`);
    console.log(`Pending: ${stats.pending}`);
    console.log(`Approved: ${stats.approved}`);
    console.log(`Rejected: ${stats.rejected}`);
});