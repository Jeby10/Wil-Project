import { createContext, useContext, useState, useEffect,useMemo } from 'react'
import { authAPI } from '../api/auth'
import { tokenManager } from '../api/client'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenManager.getAccessToken()
      const refreshToken = tokenManager.getRefreshToken()

      if (accessToken && refreshToken) {
        try {
          // Verify token is still valid by fetching user profile
          const userData = await authAPI.getProfile()
          setUser(userData?.user)
        } catch (error) {
          console.error('Failed to restore session:', error)
          tokenManager.clearTokens()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, []);

  const cachedUser = useMemo(()=>user,[user,loading]);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials)
      // authAPI.login already stores tokens, just set user
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData)
      // authAPI.register already stores tokens, just set user
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenManager.clearTokens()
      setUser(null)
    }
  }

  const isAdmin =useMemo(() => {

    return user?.role === 'admin'
  },[user,loading])

  const value = {
    user:cachedUser,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user
  }

  return <AuthContext value={value}>{children}</AuthContext>
}
