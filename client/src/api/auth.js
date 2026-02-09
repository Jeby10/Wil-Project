// src/api/auth.js
import { apiClient, tokenManager } from './client.js'

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData)

    if (response.data.tokens) {
      const { accessToken, refreshToken } = response.data.tokens
      tokenManager.setTokens(accessToken, refreshToken)
    }

    return response.data
  },

  // User login
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials)

    if (response.data.tokens) {
      const { accessToken, refreshToken } = response.data.tokens
      tokenManager.setTokens(accessToken, refreshToken)
    }

    return response.data
  },

  // Logout user
  logout: async () => {
    const refreshToken = tokenManager.getRefreshToken()

    if (refreshToken) {
      await apiClient.post('/api/auth/logout', { refreshToken })
    }

    tokenManager.clearTokens()
    return { message: 'Logged out successfully' }
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/api/auth/profile')
    return response.data
  },

  // Refresh tokens
  refreshToken: async () => {
    const refreshToken = tokenManager.getRefreshToken()

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post('/api/auth/refresh', { refreshToken })

    const { accessToken, refreshToken: newRefreshToken } = response.data.tokens
    tokenManager.setTokens(accessToken, newRefreshToken)

    return response.data
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!tokenManager.getAccessToken()
  },
}
