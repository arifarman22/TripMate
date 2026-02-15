import { createContext, useContext, useReducer } from 'react'

const ErrorContext = createContext()

const errorReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        hasError: true
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        hasError: false
      }
    default:
      return state
  }
}

const initialState = {
  error: null,
  hasError: false
}

export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState)

  const setError = (error) => {
    dispatch({
      type: 'SET_ERROR',
      payload: error
    })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    setError,
    clearError
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

export const useError = () => {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}