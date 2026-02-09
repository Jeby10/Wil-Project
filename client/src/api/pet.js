import { apiClient } from './client'

export const petAPI = {
  // Get all pets with optional filters
  getPets: async (filters = {}) => {
    const params = new URLSearchParams()

    if (filters.petType) params.append('petType', filters.petType)
    if (filters.size) params.append('size', filters.size)
    if (filters.breed) params.append('breed', filters.breed)
    if (filters.age) params.append('age', filters.age)
    if (filters.location) params.append('location', filters.location)
    if (filters.urgent !== undefined) params.append('urgent', filters.urgent)

    const queryString = params.toString()
    const url = queryString ? `/api/pets?${queryString}` : '/api/pets'

    const response = await apiClient.get(url)
    return response.data
  },

  // Get single pet by ID
  getPet: async (id) => {
    const response = await apiClient.get(`/api/pets/${id}`)
    return response.data
  },

  // Admin: Create new pet
  createPet: async (petData) => {
    const response = await apiClient.post('/api/pets', petData)
    return response.data
  },

  // Admin: Update pet
  updatePet: async (id, petData) => {
    const response = await apiClient.put(`/api/pets/${id}`, petData)
    return response.data
  },

  // Admin: Delete pet
  deletePet: async (id) => {
    const response = await apiClient.delete(`/api/pets/${id}`)
    return response.data
  }
}
