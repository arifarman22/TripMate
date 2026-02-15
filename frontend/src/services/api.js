import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (response?.status === 403) {
      toast.error('Access denied')
    } else if (response?.status === 404) {
      toast.error('Resource not found')
    } else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (response?.data?.error?.message) {
      toast.error(response.data.error.message)
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Network error. Please check your connection.')
    } else {
      toast.error('Something went wrong')
    }

    return Promise.reject(error)
  }
)

export default api