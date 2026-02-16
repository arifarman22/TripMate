import { Mail, Check, X, MapPin, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const TripInvitationCard = ({ invitation, onAccept, onDecline }) => {
  const navigate = useNavigate()
  const [accepting, setAccepting] = useState(false)
  const [declining, setDeclining] = useState(false)

  const handleAccept = async () => {
    setAccepting(true)
    try {
      await onAccept(invitation.tripId)
      toast.success(`You've joined ${invitation.tripName}!`)
      navigate(`/trips/${invitation.tripId}`)
    } catch (error) {
      toast.error('Failed to accept invitation')
    } finally {
      setAccepting(false)
    }
  }

  const handleDecline = async () => {
    setDeclining(true)
    try {
      await onDecline(invitation.tripId)
      toast.success('Invitation declined')
    } catch (error) {
      toast.error('Failed to decline invitation')
    } finally {
      setDeclining(false)
    }
  }

  return (
    <div className="travel-card p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Trip Invitation</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              New
            </span>
          </div>
          
          <p className="text-gray-700 mb-3">
            <span className="font-medium">{invitation.invitedBy}</span> invited you to join
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">{invitation.tripName}</h4>
            </div>
            {invitation.description && (
              <p className="text-sm text-gray-600 mb-2">{invitation.description}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{invitation.memberCount} members</span>
              </div>
              {invitation.budget && (
                <span className="font-medium">
                  Budget: {invitation.currency} {invitation.budget}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleAccept}
              disabled={accepting || declining}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 inline-flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{accepting ? 'Accepting...' : 'Accept'}</span>
            </button>
            <button
              onClick={handleDecline}
              disabled={accepting || declining}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 inline-flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>{declining ? 'Declining...' : 'Decline'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripInvitationCard
