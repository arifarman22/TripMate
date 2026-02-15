import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken()
      const user = authService.getCurrentUser()

      if (token && user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token }
        })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { user, token } = await authService.login(email, password)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      })
      return { success: true }
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response?.data?.message || 'Login failed'
      })
      return { success: false, error: error.response?.data?.message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { user, token } = await authService.register(userData)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      })
      return { success: true }
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response?.data?.message || 'Registration failed'
      })
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = () => {
    authService.logout()
    dispatch({ type: 'LOGOUT' })
  }

  const value = {
    ...state,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}