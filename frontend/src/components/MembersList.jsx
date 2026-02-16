import { Users, Crown, User, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { tripService } from '../services/tripService'
import toast from 'react-hot-toast'

const MembersList = ({ members, tripId, currentUserId, isAdmin, onMemberRemoved }) => {
  const [removingId, setRemovingId] = useState(null)

  const handleRemoveMember = async (userId, userName) => {
    if (!confirm(`Remove ${userName} from this trip?`)) return

    setRemovingId(userId)
    try {
      await tripService.removeMember(tripId, userId)
      toast.success(`${userName} has been removed from the trip`)
      onMemberRemoved(userId)
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="travel-card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Trip Members</h3>
        <span className="text-sm text-gray-500">({members.length})</span>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {member.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{member.user.name}</p>
                  {member.role === 'admin' && (
                    <Crown className="w-4 h-4 text-yellow-500" title="Team Lead" />
                  )}
                  {member.userId === currentUserId && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>
            </div>

            {isAdmin && member.role !== 'admin' && member.userId !== currentUserId && (
              <button
                onClick={() => handleRemoveMember(member.userId, member.user.name)}
                disabled={removingId === member.userId}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Remove member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MembersList
