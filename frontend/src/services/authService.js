import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    const { token, user } = response.data.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return { token, user }
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    const { token, user } = response.data.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return { token, user }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken() {
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    return !!this.getToken()
  }
}