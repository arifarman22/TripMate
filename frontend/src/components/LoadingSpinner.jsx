import { Plane } from 'lucide-react'

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <Plane className={`${sizeClasses[size]} text-blue-400`} />
        </div>
        <Plane className={`${sizeClasses[size]} text-blue-600 animate-bounce-gentle`} />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
    </div>
  )
}

export default LoadingSpinner