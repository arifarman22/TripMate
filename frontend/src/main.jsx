import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ErrorProvider } from './context/ErrorContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff'
                }
              }
            }}
          />
        </AuthProvider>
      </ErrorProvider>
    </BrowserRouter>
  </React.StrictMode>,
)