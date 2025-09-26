import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function AssignModal({ ticketId, onClose, onAssigned }) {
  const [agentId, setAgentId] = useState('')
  const [status, setStatus] = useState('Open')
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  // fetch agents from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/users?role=Agent')
        setAgents(res.data.data || [])
      } catch (e) {
        console.error('Failed to load agents', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const assign = async () => {
    if (!agentId) return
    try {
      const res = await api.put(`/tickets/${ticketId}/assign`, {
        agentId,
        status
      })
      if (onAssigned) onAssigned(res.data.data)
      onClose()
    } catch (e) {
      console.error('Assignment failed', e)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Assign Ticket</h2>

        {loading ? (
          <div className="text-sm text-gray-500">Loading agents...</div>
        ) : (
          <select
            value={agentId}
            onChange={e => setAgentId(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
          >
            <option value="">Select agent</option>
            {agents.map(a => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
        )}

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option>New</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={assign}
            disabled={!agentId}
            className="px-3 py-1 bg-brand text-white rounded disabled:opacity-50"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}
