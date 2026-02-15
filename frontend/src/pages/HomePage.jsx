import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Plane, 
  Users, 
  Calculator, 
  Shield, 
  ArrowRight,
  MapPin,
  CreditCard,
  PieChart
} from 'lucide-react'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Users,
      title: 'Split with Friends',
      description: 'Easily split expenses among your travel companions with flexible splitting options.'
    },
    {
      icon: Calculator,
      title: 'Smart Calculations',
      description: 'Automatic balance calculations and settlement suggestions to minimize transactions.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and secure with enterprise-grade security.'
    },
    {
      icon: PieChart,
      title: 'Visual Reports',
      description: 'Beautiful charts and reports to track your spending and budget progress.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center travel-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2835&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-cyan-900/50"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full">
              <Plane className="w-16 h-16 text-white animate-bounce-gentle" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow">
            Trip<span className="text-cyan-300">Mate</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto text-shadow">
            Smart expense splitter for your travel adventures. 
            Split bills, track expenses, and settle up with friends effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TripMate?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Make your group travels stress-free with our smart expense management tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers who trust TripMate for their group expenses
          </p>
          
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Journey
              <MapPin className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage