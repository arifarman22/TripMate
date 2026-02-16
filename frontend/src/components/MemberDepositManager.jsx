import { useState } from 'react'
import { Wallet, Edit2, Check, X } from 'lucide-react'
import { tripService } from '../services/tripService'
import toast from 'react-hot-toast'

const MemberDepositManager = ({ members, tripId, currency, isAdmin, onUpdate }) => {
  const [editingId, setEditingId] = useState(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [updating, setUpdating] = useState(false)

  const handleEdit = (member) => {
    setEditingId(member.userId)
    setDepositAmount(member.depositAmount || 0)
  }

  const handleSave = async (userId) => {
    setUpdating(true)
    try {
      await tripService.updateMemberDeposit(tripId, userId, parseFloat(depositAmount))
      toast.success('Deposit updated successfully')
      setEditingId(null)
      onUpdate()
    } catch (error) {
      toast.error('Failed to update deposit')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setDepositAmount('')
  }

  const totalDeposits = members.reduce((sum, m) => sum + (m.depositAmount || 0), 0)

  return (
    <div className="travel-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Member Deposits</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Deposited</p>
          <p className="text-xl font-bold text-green-600">
            {currency} {totalDeposits.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {member.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{member.user.name}</p>
                <p className="text-xs text-gray-500">{member.user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {editingId === member.userId ? (
                <>
                  <input
                    type="number"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    disabled={updating}
                  />
                  <button
                    onClick={() => handleSave(member.userId)}
                    disabled={updating}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={updating}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="font-semibold text-gray-900">
                    {currency} {(member.depositAmount || 0).toFixed(2)}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemberDepositManager
