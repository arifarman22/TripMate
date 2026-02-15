import api from './api'

export const expenseService = {
  async getExpenses(tripId) {
    const response = await api.get(`/trips/${tripId}/expenses`)
    return response.data.data
  },

  async createExpense(tripId, expenseData) {
    const response = await api.post(`/trips/${tripId}/expenses`, expenseData)
    return response.data.data
  },

  async updateExpense(expenseId, expenseData) {
    const response = await api.put(`/expenses/${expenseId}`, expenseData)
    return response.data.data
  },

  async deleteExpense(expenseId) {
    const response = await api.delete(`/expenses/${expenseId}`)
    return response.data
  }
}