import { Link } from 'react-router-dom'
import { Home, MapPin } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Lost traveler"
            className="w-64 h-64 object-cover rounded-full mx-auto mb-6 shadow-xl"
          />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          Looks like you're off the map!
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <Link
            to="/trips"
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <MapPin className="w-5 h-5" />
            <span>View Trips</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage