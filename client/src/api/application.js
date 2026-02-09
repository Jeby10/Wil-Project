import { apiClient } from './client'

export const applicationAPI = {
  // Submit new application
  submitApplication: async (applicationData) => {
    const response = await apiClient.post('/api/applications', applicationData)
    return response.data
  },

  // Get user's applications
  getMyApplications: async () => {
    const response = await apiClient.get('/api/applications')
    return response.data
  },

  // Get single application
  getApplication: async (id) => {
    const response = await apiClient.get(`/api/applications/${id}`)
    return response.data
  },

  // Admin: Get all applications with optional status filter
  getAllApplications: async (status = 'all') => {
    const url = status && status !== 'all'
      ? `/api/applications/admin/all?status=${status}`
      : '/api/applications/admin/all'
    const response = await apiClient.get(url)
    return response.data
  },

  // Admin: Get application statistics
  getApplicationStats: async () => {
    const response = await apiClient.get('/api/applications/admin/stats')
    return response.data
  },

  // Admin: Update application status
  updateApplication: async (id, updateData) => {
    const response = await apiClient.put(`/api/applications/${id}`, updateData)
    return response.data
  },

  // Admin: Delete application
  deleteApplication: async (id) => {
    const response = await apiClient.delete(`/api/applications/${id}`)
    return response.data
  }
}
