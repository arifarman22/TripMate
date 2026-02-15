import { useState, useEffect } from 'react'
import { tripService } from '../services/tripService'
import { expenseService } from '../services/expenseService'
import toast from 'react-hot-toast'

export const useTrip = (tripId) => {
  const [trip, setTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTripData = async () => {
    if (!tripId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const [tripData, expensesData, balancesData] = await Promise.all([
        tripService.getTripById(tripId),
        expenseService.getExpenses(tripId),
        tripService.getBalances(tripId)
      ])
      
      setTrip(tripData)
      setExpenses(expensesData)
      setBalances(balancesData)
    } catch (err) {
      setError(err.message || 'Failed to load trip data')
      toast.error('Failed to load trip data')
    } finally {
      setLoading(false)
    }
  }

  const addExpense = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev])
    // Refresh balances after adding expense
    refreshBalances()
  }

  const removeExpense = (expenseId) => {
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId))
    // Refresh balances after removing expense
    refreshBalances()
  }

  const refreshBalances = async () => {
    try {
      const balancesData = await tripService.getBalances(tripId)
      setBalances(balancesData)
    } catch (err) {
      console.error('Failed to refresh balances:', err)
    }
  }

  useEffect(() => {
    fetchTripData()
  }, [tripId])

  return {
    trip,
    expenses,
    balances,
    loading,
    error,
    addExpense,
    removeExpense,
    refreshBalances,
    refetch: fetchTripData
  }
}