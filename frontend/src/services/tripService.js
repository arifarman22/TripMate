import api from './api'

export const tripService = {
  async getTrips() {
    const response = await api.get('/trips')
    return response.data.data
  },

  async getTripById(id) {
    const response = await api.get(`/trips/${id}`)
    return response.data.data
  },

  async createTrip(tripData) {
    const response = await api.post('/trips', tripData)
    return response.data.data
  },

  async updateTrip(id, tripData) {
    const response = await api.put(`/trips/${id}`, tripData)
    return response.data.data
  },

  async deleteTrip(id) {
    const response = await api.delete(`/trips/${id}`)
    return response.data
  },

  async addMember(tripId, email) {
    const response = await api.post(`/trips/${tripId}/members`, { email })
    return response.data.data
  },

  async removeMember(tripId, userId) {
    const response = await api.delete(`/trips/${tripId}/members`, { userId })
    return response.data
  },

  async getBalances(tripId) {
    const response = await api.get(`/trips/${tripId}/balances`)
    return response.data.data
  },

  async getSuggestedPayments(tripId) {
    const response = await api.get(`/trips/${tripId}/suggested-payments`)
    return response.data.data
  },

  async getUserBalance(tripId) {
    const response = await api.get(`/trips/${tripId}/my-balance`)
    return response.data.data
  }
}